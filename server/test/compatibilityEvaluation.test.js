const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  assertDataset,
  calculateMetrics,
  calibrateThreshold,
  evaluateDataset
} = require('../services/compatibilityEvaluation');

function sampleDataset() {
  const record = (studentId, projectId, skill, label) => ({
    studentId,
    projectId,
    profile: { skills: [{ name: skill }] },
    project: { requiredSkills: [{ name: 'React' }] },
    label
  });
  return {
    metadata: { name: 'Unit-test fixture only', labelingMethod: 'human_review' },
    train: [record('train-student', 'train-project', 'React', 'RELEVANT')],
    validation: [
      record('validation-student-1', 'validation-project-1', 'React', 'RELEVANT'),
      record('validation-student-2', 'validation-project-2', 'Java', 'NOT_RELEVANT')
    ],
    test: [
      record('test-student-1', 'test-project-1', 'React', 'RELEVANT'),
      record('test-student-2', 'test-project-2', 'Java', 'NOT_RELEVANT')
    ]
  };
}

test('calculates accuracy, precision, recall, F1, and confusion matrix', () => {
  const result = calculateMetrics([
    { score: 90, label: 'RELEVANT' },
    { score: 80, label: 'NOT_RELEVANT' },
    { score: 40, label: 'RELEVANT' },
    { score: 10, label: 'NOT_RELEVANT' }
  ], 60);

  assert.equal(result.accuracy, 0.5);
  assert.equal(result.precision, 0.5);
  assert.equal(result.recall, 0.5);
  assert.equal(result.f1, 0.5);
  assert.deepEqual(result.confusionMatrix, {
    truePositive: 1,
    trueNegative: 1,
    falsePositive: 1,
    falseNegative: 1
  });
});

test('calibrates threshold on validation data only', () => {
  const result = calibrateThreshold([
    { score: 100, label: 'RELEVANT' },
    { score: 0, label: 'NOT_RELEVANT' }
  ], { defaultThreshold: 60 });

  assert.equal(result.metrics.f1, 1);
  assert.equal(result.metrics.accuracy, 1);
  assert.equal(result.threshold, 100);
});

test('evaluates a separate held-out test split without leakage', () => {
  const result = evaluateDataset(sampleDataset());

  assert.equal(result.dataset.total, 5);
  assert.equal(result.dataset.meetsPreferredMinimum, false);
  assert.equal(result.thresholdCalibration.threshold, 100);
  assert.equal(result.test.metrics.accuracy, 1);
  assert.equal(result.test.examples.length, 2);
});

test('rejects datasets with identities shared between splits', () => {
  const dataset = sampleDataset();
  dataset.test[0].studentId = dataset.validation[0].studentId;

  assert.throws(() => assertDataset(dataset), /share a studentId/);
});

test('requires a non-empty labeled human-reviewed train, validation, and test split', () => {
  const dataset = sampleDataset();
  dataset.metadata.labelingMethod = 'synthetic';
  assert.throws(() => assertDataset(dataset), /human_review/);

  const noValidation = sampleDataset();
  noValidation.validation = [];
  assert.throws(() => assertDataset(noValidation), /validation split/);
});
