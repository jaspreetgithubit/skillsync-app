export async function fetchProjectCompatibility(projectId, fetchImplementation = fetch) {
  const response = await fetchImplementation(
    `/api/projects/${encodeURIComponent(projectId)}/compatibility`,
    { credentials: 'include' }
  );
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success || !body.data?.compatibility) {
    const error = new Error(body?.error?.message || `Compatibility service returned HTTP ${response.status}.`);
    error.code = body?.error?.code || 'COMPATIBILITY_REQUEST_FAILED';
    error.status = response.status;
    throw error;
  }
  return body.data;
}

export function getCompatibilityErrorMessage(error) {
  switch (error?.code) {
    case 'PROFILE_NOT_FOUND':
      return 'No confirmed student profile was found for this account. Complete your profile, then retry.';
    case 'PROFILE_NOT_CONFIRMED':
      return 'Your student profile must be confirmed before checking project compatibility.';
    case 'PROJECT_REQUIREMENTS_NOT_CONFIGURED':
      return 'This project does not have skill requirements configured yet.';
    case 'AUTHENTICATION_REQUIRED':
      return 'Your session has expired. Sign in again to check compatibility.';
    default:
      return error?.message || 'Compatibility could not be calculated. Please try again.';
  }
}
