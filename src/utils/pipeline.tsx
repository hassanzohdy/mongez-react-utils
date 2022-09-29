import { prepareResponse } from "./utils";

/**
 * Load the given array of requests that depend on each other.
 */
export default function pipeline(
  requests: ((
    props: any,
    previousResponse: any,
    responses: any[]
  ) => Promise<any>)[]
) {
  const responses: any[] = [];

  return (props: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        for (let request of requests) {
          const response = await request(
            props,
            responses[responses.length - 1],
            responses
          );

          responses.push(await prepareResponse(response));
        }

        resolve(responses);
      } catch (error) {
        reject(error, responses);
      }
    });
  };
}
