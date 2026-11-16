export async function fetchTeamRecommendations(projectId, fetchImplementation = fetch) {
  const response = await fetchImplementation(
    `/api/projects/${encodeURIComponent(projectId)}/team-recommendations`,
    { credentials: 'include' }
  );
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success || !Array.isArray(body.recommendations)) {
    const error = new Error(body?.error?.message || `Team recommendation service returned HTTP ${response.status}.`);
    error.code = body?.error?.code || 'TEAM_RECOMMENDATIONS_FAILED';
    error.status = response.status;
    throw error;
  }
  return body;
}

export function getTeamRecommendationsErrorMessage(error) {
  switch (error?.code) {
    case 'AUTHENTICATION_REQUIRED':
      return 'Your sign-in session has expired. Sign in again before finding teams.';
    case 'PROJECT_REQUIREMENTS_NOT_CONFIGURED':
      return 'Add at least one required project skill before generating team recommendations.';
    case 'INSUFFICIENT_ELIGIBLE_STUDENTS':
      return `${error.message} Students need a confirmed profile with at least one technical skill.`;
    case 'SEARCH_LIMIT_EXCEEDED':
      return error.message || 'The eligible student pool exceeds the current search limit.';
    case 'INVALID_TEAM_SIZE':
      return error.message || 'Set a valid project team size before generating recommendations.';
    default:
      return error?.message || 'Team recommendations could not be calculated. Please try again.';
  }
}
