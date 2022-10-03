import React, { useEffect, useState } from "react";
import { PreloadConfigurations, PreloadRequest } from "./types";
import { prepareResponse } from "./utils";

let preloadConfigurations: PreloadConfigurations = {
  cache: true,
};

const caches: Record<string, any> = {};

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
  Component: React.ComponentType<any>,
  request: PreloadRequest | PreloadRequest[],
  preloadConfig: PreloadConfigurations = {}
): React.FC<any> {
  let configurations: PreloadConfigurations = {
    ...preloadConfigurations,
    ...preloadConfig,
  };

  return function LoadComponent(props: any) {
    const [isLoading, loading] = useState(() =>
      configurations.cache ? Boolean(caches[request.toString()]) : true
    );
    const [error, setError] = useState<any | null>(null);
    const [response, setResponse] = useState<any | any[]>(() =>
      configurations.cache ? caches[request.toString()] : null
    );

    const updateResponse = (response: any) => {
      setResponse(response);
      loading(false);
      if (configurations.cache) {
        caches[request.toString()] = response;
      }
    };

    useEffect(() => {
      if (Array.isArray(request)) {
        Promise.all(request.map((data) => data(props))).then(
          async (responses) => {
            let finalResponses: any[] = [];
            for (let response of responses) {
              response = await prepareResponse(response);

              finalResponses.push(response);
            }

            preloadConfigurations.onSuccess?.(finalResponses);
            updateResponse(finalResponses);
          },
          (error) => {
            preloadConfigurations.onError?.(error);
            setError(error);
            loading(false);
          }
        );
      } else {
        request(props)
          .then(async (response) => {
            response = await prepareResponse(response);
            preloadConfigurations.onSuccess?.(response);
            updateResponse(response);
          })
          .catch((error) => {
            preloadConfigurations.onError?.(error);
            setError(error);
            loading(false);
          });
      }
    }, [request]);

    if (isLoading || error) {
      return configurations.loadingErrorComponent ? (
        <configurations.loadingErrorComponent
          isLoading={isLoading}
          error={error}
        />
      ) : null;
    }

    return (
      <Component
        {...props}
        {...(configurations.componentProps || {})}
        response={response}
      />
    );
  };
}
