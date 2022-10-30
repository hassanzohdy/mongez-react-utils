import React, { useEffect, useState } from "react";
import { PreloadConfigurations, PreloadRequest } from "./types";
import { prepareResponse } from "./utils";

let preloadConfigurations: PreloadConfigurations = {
  cache: {
    key: "",
    expiresAfter: 5 * 60, // 5 minutes
  },
  componentProps: {},
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

export function getPreloadConfigurations() {
  return preloadConfigurations;
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

  const requestText = request.toString();

  const getCacheKey = (props) => {
    if (!configurations.cache) return "";

    const cacheKey = configurations.cache.key;

    if (!cacheKey) return requestText;

    return (
      (typeof cacheKey === "string" ? cacheKey : cacheKey(props)) + requestText
    );
  };

  const getCache = (cacheKey) => {
    if (
      configurations.cache === false ||
      configurations.cache?.expiresAfter === 0
    )
      return null;

    const requestCache = caches[cacheKey];

    if (!requestCache) return;

    const { expiresAfter, response } = requestCache;

    if (expiresAfter && Date.now() > expiresAfter) {
      delete caches[cacheKey];
      return;
    }

    return response;
  };

  const cacheResponse = (cacheKey, response) => {
    const cache = configurations.cache;

    if (!cache) return;

    caches[cacheKey] = {
      response,
      expiresAt: new Date().getTime() + (cache.expiresAfter || 0) * 1000,
    };
  };

  return function LoadComponent(props: any) {
    const [requestCacheKey, responseCache] = React.useMemo(() => {
      const requestCacheKey = getCacheKey(props);
      const responseCache = getCache(requestCacheKey);

      return [requestCacheKey, responseCache];
    }, [props]);

    const [isLoading, loading] = useState(!Boolean(responseCache));

    const [error, setError] = useState<any | null>(null);
    const [response, setResponse] = useState<any | any[]>(responseCache);

    const updateResponse = (response: any) => {
      setResponse(response);
      loading(false);

      cacheResponse(requestCacheKey, response);
    };

    useEffect(() => {
      if (responseCache) return;

      if (Array.isArray(request)) {
        Promise.all(request.map((data) => data(props))).then(
          async (responses) => {
            let finalResponses: any[] = [];
            for (let response of responses) {
              response = await prepareResponse(response);

              finalResponses.push(response);
            }

            configurations.onSuccess?.(finalResponses);
            updateResponse(finalResponses);
          },
          (error) => {
            configurations.onError?.(error);
            setError(error);
            loading(false);
          }
        );
      } else {
        request(props)
          .then(async (response) => {
            response = await prepareResponse(response);
            configurations.onSuccess?.(response);
            updateResponse(response);
          })
          .catch((error) => {
            configurations.onError?.(error);
            setError(error);
            loading(false);
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request]);

    if (isLoading || error) {
      const Component = configurations.loadingErrorComponent;
      return Component ? (
        <Component isLoading={isLoading} error={error} />
      ) : null;
    }

    return (
      <Component
        {...props}
        {...configurations.componentProps}
        response={response}
      />
    );
  };
}
