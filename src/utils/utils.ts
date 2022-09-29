/**
 * If the given response is a fetch api response, then convert its data
 */
export async function prepareResponse(response: any) {
  if (usingFetchApi(response)) {
    response.data = await (response.json || response.text)();
  }

  return response;
}

/**
 * Check if the given response is a fetch api response
 */
export function usingFetchApi(response: any): boolean {
  return response instanceof Response;
}
