const { scoreProjectCompatibility } = require('./projectCompatibilityService');

const SPLITS = ['train', 'validation', 'test'];
const LABELS = new Set(['RELEVANT', 'NOT_RELEVANT']);

function assertDataset(dataset) {
  if (!dataset || typeof dataset !== 'object' || dataset.metadata?.labelingMethod !== 'human_review') {
    throw new TypeError('Dataset metadata must declare labelingMethod: "human_review".');
  }
  for (const split of SPLITS) {
    if (!Array.isArray(dataset[split]) || dataset[split].length === 0) {
      throw new TypeError(`The ${split} split must contain human-reviewed examples.`);
    }
    for (const [index, record] of dataset[split].entries()) {
      if (!record || typeof record !== 'object'
        || typeof record.studentId !== 'string' || record.studentId.trim() === ''
        || typeof record.projectId !== 'string' || record.projectId.trim() === ''
        || !record.profile || typeof record.profile !== 'object'
        || !record.project || typeof record.project !== 'object'
        || !LABELS.has(record.label)) {
        throw new TypeError(`Invalid ${split} example at index ${index}; include studentId, projectId, profile, project, and a human-reviewed label.`);
      }
    }
  }

  for (let left = 0; left < SPLITS.length; left += 1) {
    for (let right = left + 1; right < SPLITS.length; right += 1) {
      for (const idType of ['studentId', 'projectId']) {
        const leftIds = new Set(dataset[SPLITS[left]].map((record) => record[idType]));
        if (dataset[SPLITS[right]].some((record) => leftIds.has(record[idType]))) {
          throw new TypeError(`The ${SPLITS[left]} and ${SPLITS[right]} splits share a ${idType}; split identities must not leak across datasets.`);
        }
      }
    }
  }
  return dataset;
}

function calculateMetrics(records, threshold) {
  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;
  for (const record of records) {
    const predictedRelevant = record.score >= threshold;
    const actuallyRelevant = record.label === 'RELEVANT';
    if (predictedRelevant && actuallyRelevant) truePositive += 1;
    else if (!predictedRelevant && !actuallyRelevant) trueNegative += 1;
    else if (predictedRelevant) falsePositive += 1;
    else falseNegative += 1;
  }

  const total = records.length;
  const precision = truePositive + falsePositive === 0 ? 0 : truePositive / (truePositive + falsePositive);
  const recall = truePositive + falseNegative === 0 ? 0 : truePositive / (truePositive + falseNegative);
  const f1 = precision + recall === 0 ? 0 : 2 * precision * recall / (precision + recall);
  return {
    total,
    correctlyClassified: truePositive + trueNegative,
    incorrectlyClassified: falsePositive + falseNegative,
    accuracy: total === 0 ? null : (truePositive + trueNegative) / total,
    precision,
    recall,
    f1,
    confusionMatrix: {
      truePositive,
      trueNegative,
      falsePositive,
      falseNegative
    }
  };
}

function scoreRecords(records, config) {
  return records.map((record) => ({
    studentId: record.studentId,
    projectId: record.projectId,
    label: record.label,
    score: scoreProjectCompatibility(record.profile, record.project, { config }).score
  }));
}

function calibrateThreshold(validationRecords, options = {}) {
  if (!Array.isArray(validationRecords) || validationRecords.length === 0) {
    throw new TypeError('A non-empty validation split is required to calibrate the threshold.');
  }
  const candidates = new Set([0, 100]);
  for (const record of validationRecords) candidates.add(Math.max(0, Math.min(100, Math.round(record.score * 10) / 10)));

  let best = null;
  for (const threshold of candidates) {
    const metrics = calculateMetrics(validationRecords, threshold);
    const candidate = { threshold, metrics };
    const bestF1 = best?.metrics.f1 ?? -1;
    const bestAccuracy = best?.metrics.accuracy ?? -1;
    const preferredDefaultDistance = Math.abs(threshold - (options.defaultThreshold ?? 60));
    const bestDefaultDistance = Math.abs((best?.threshold ?? 60) - (options.defaultThreshold ?? 60));
    if (!best
      || metrics.f1 > bestF1
      || (metrics.f1 === bestF1 && metrics.accuracy > bestAccuracy)
      || (metrics.f1 === bestF1 && metrics.accuracy === bestAccuracy && preferredDefaultDistance < bestDefaultDistance)) {
      best = candidate;
    }
  }
  return best;
}

function evaluateDataset(dataset, options = {}) {
  assertDataset(dataset);
  const config = options.config;
  const scored = Object.fromEntries(SPLITS.map((split) => [split, scoreRecords(dataset[split], config)]));
  const calibrated = calibrateThreshold(scored.validation, {
    defaultThreshold: options.defaultThreshold ?? 60
  });
  const testExamples = scored.test.map((record) => ({
    ...record,
    predictedLabel: record.score >= calibrated.threshold ? 'RELEVANT' : 'NOT_RELEVANT',
    correct: (record.score >= calibrated.threshold) === (record.label === 'RELEVANT')
  }));
  return {
    dataset: {
      name: dataset.metadata.name || 'Human-reviewed compatibility dataset',
      labelingMethod: dataset.metadata.labelingMethod,
      splitStrategy: 'No studentId or projectId is shared across train, validation, and test splits.',
      sizes: Object.fromEntries(SPLITS.map((split) => [split, scored[split].length])),
      total: SPLITS.reduce((total, split) => total + scored[split].length, 0),
      preferredMinimum: 200,
      meetsPreferredMinimum: SPLITS.reduce((total, split) => total + scored[split].length, 0) >= 200
    },
    thresholdCalibration: {
      method: 'Highest validation F1; ties use higher accuracy, then proximity to the default threshold.',
      threshold: calibrated.threshold,
      validationMetrics: calibrated.metrics
    },
    test: {
      metrics: calculateMetrics(testExamples, calibrated.threshold),
      examples: testExamples
    }
  };
}

module.exports = {
  SPLITS,
  assertDataset,
  calculateMetrics,
  calibrateThreshold,
  evaluateDataset
};
