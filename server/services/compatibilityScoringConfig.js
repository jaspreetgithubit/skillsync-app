const DEFAULT_SCORING_WEIGHTS = Object.freeze({
  required: 70,
  preferred: 20
});

const DEFAULT_CLASSIFICATION_THRESHOLD = 60;

function readScoringConfig(env = process.env) {
  const weights = {
    required: Number(env.COMPATIBILITY_REQUIRED_WEIGHT ?? DEFAULT_SCORING_WEIGHTS.required),
    preferred: Number(env.COMPATIBILITY_PREFERRED_WEIGHT ?? DEFAULT_SCORING_WEIGHTS.preferred)
  };
  const threshold = Number(env.COMPATIBILITY_CLASSIFICATION_THRESHOLD ?? DEFAULT_CLASSIFICATION_THRESHOLD);
  if (Object.values(weights).some((weight) => !Number.isFinite(weight) || weight < 0)
    || Object.values(weights).every((weight) => weight === 0)) {
    throw new TypeError('Compatibility scoring weights must be non-negative, finite, and not all zero.');
  }
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
    throw new TypeError('Compatibility classification threshold must be between 0 and 100.');
  }
  return { weights, threshold };
}

module.exports = {
  DEFAULT_CLASSIFICATION_THRESHOLD,
  DEFAULT_SCORING_WEIGHTS,
  readScoringConfig
};
