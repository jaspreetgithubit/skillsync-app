#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { DEFAULT_CLASSIFICATION_THRESHOLD, readScoringConfig } = require('../services/compatibilityScoringConfig');
const { evaluateDataset } = require('../services/compatibilityEvaluation');

function markdownReport(report, evaluatedAt) {
  const metrics = report.test.metrics;
  return [
    '# Individual Compatibility Evaluation',
    '',
    `- Evaluated at: ${evaluatedAt}`,
    `- Dataset: ${report.dataset.name}`,
    `- Human-reviewed pairs: ${report.dataset.total}`,
    `- Preferred minimum of 200 pairs met: ${report.dataset.meetsPreferredMinimum ? 'yes' : 'no'}`,
    `- Split sizes: ${Object.entries(report.dataset.sizes).map(([name, count]) => `${name} ${count}`).join(', ')}`,
    `- Split strategy: ${report.dataset.splitStrategy}`,
    `- Validation-calibrated threshold: ${report.thresholdCalibration.threshold}`,
    `- Held-out test accuracy: ${formatPercent(metrics.accuracy)}`,
    `- Precision: ${formatPercent(metrics.precision)}`,
    `- Recall: ${formatPercent(metrics.recall)}`,
    `- F1-score: ${formatPercent(metrics.f1)}`,
    '',
    '## Held-out test confusion matrix',
    '',
    '| | Predicted relevant | Predicted not relevant |',
    '|---|---:|---:|',
    `| Actually relevant | ${metrics.confusionMatrix.truePositive} | ${metrics.confusionMatrix.falseNegative} |`,
    `| Actually not relevant | ${metrics.confusionMatrix.falsePositive} | ${metrics.confusionMatrix.trueNegative} |`,
    '',
    metrics.accuracy > 0.9
      ? 'The held-out test accuracy exceeds 90% for this human-reviewed dataset.'
      : 'The held-out test accuracy does not exceed 90% (or the result is below the target).'
  ].join('\n');
}

function formatPercent(value) {
  return value == null ? 'not available' : `${(value * 100).toFixed(2)}%`;
}

function run(args = process.argv.slice(2)) {
  const datasetPath = args[0];
  if (!datasetPath || args.length > 2) {
    throw new TypeError('Usage: node server/scripts/evaluate-compatibility.js <human-reviewed-dataset.json> [output-file-prefix]');
  }
  const absoluteDatasetPath = path.resolve(datasetPath);
  const outputPrefix = path.resolve(args[1] || absoluteDatasetPath.replace(/\.json$/i, '.evaluation'));
  const dataset = JSON.parse(fs.readFileSync(absoluteDatasetPath, 'utf8'));
  const scoringConfig = readScoringConfig();
  const report = evaluateDataset(dataset, {
    config: scoringConfig,
    defaultThreshold: DEFAULT_CLASSIFICATION_THRESHOLD
  });
  const evaluatedAt = new Date().toISOString();
  report.evaluatedAt = evaluatedAt;
  report.scoringWeights = scoringConfig.weights;
  report.accuracyTarget = 0.9;
  fs.writeFileSync(`${outputPrefix}.json`, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
  fs.writeFileSync(`${outputPrefix}.md`, `${markdownReport(report, evaluatedAt)}\n`, { flag: 'wx' });
  console.log(`Wrote ${outputPrefix}.json and ${outputPrefix}.md`);
  console.log(`Held-out test accuracy: ${formatPercent(report.test.metrics.accuracy)} at validation threshold ${report.thresholdCalibration.threshold}.`);
  if (report.test.metrics.accuracy <= 0.9) process.exitCode = 2;
}

if (require.main === module) {
  try {
    run();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { markdownReport, run };
