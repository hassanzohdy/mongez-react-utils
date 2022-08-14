import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { PreloadConfigurations } from "./types";

export type PreloadRequest = (props: any) => Promise<AxiosResponse>;

let preloadConfigurations: PreloadConfigurations = {};

/**
 * Set preloader configurations
 */
export function setPreloadConfiguration(
  config: Partial<PreloadConfigurations>
) {
  preloadConfigurations = { ...preloadConfigurations, ...config };
}

/**
 * Load the given request(s) then render the given component once the response is loaded.
 * This utility accept single request or an array of requests.
 * the response of the request is sent to the given component alongside with the passed props.
 */
export default function preload(
  Component: React.ComponentType,
  request: PreloadRequest | PreloadRequest[],
  morePropsToPass: any = {},
  preloadConfig: Partial<PreloadConfigurations> = {}
): React.FC<any> {
  let configurations: PreloadConfigurations = {
    ...preloadConfigurations,
    ...preloadConfig,
  };

  const LoadingErrorHandler = configurations.loadingErrorHandler;

  return function LoadComponent(props: any) {
    const [isLoading, loading] = useState(true);
    const [error, setError] = useState<any | null>(null);
    const [response, setResponse] = useState<any | any[]>(null);

    useEffect(() => {
      if (Array.isArray(request)) {
        Promise.all(request.map((data) => data(props))).then(
          (responses) => {
            setResponse(responses);
            loading(false);
          },
          (error) => {
            setError(error);
            loading(false);
          }
        );
      } else {
        request(props)
          .then((response) => {
            setResponse(response);
            loading(false);
          })
          .catch((error) => {
            setError(error);
            loading(false);
          });
      }
    }, [request]);

    if (isLoading || error) {
      return <LoadingErrorHandler isLoading={isLoading} error={error} />;
    }

    return <Component {...props} {...morePropsToPass} response={response} />;
  };
}
