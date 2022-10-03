import React from "react";

export type PreloadRequest = (props: any) => Promise<any>;

export type LoadingErrorComponentProps = {
  isLoading: boolean;
  error: any;
};

export type PreloadConfigurations = {
  /**
   * Define the component to be rendered while the data is being fetched or when error occurs.
   */
  loadingErrorComponent?: React.ComponentType<LoadingErrorComponentProps>;
  /**
   * Pass more component props
   */
  componentProps?: any;
  /**
   * Cache the response
   *
   * @default true
   */
  cache?: boolean;
  /**
   * Triggered when the request has an error.
   */
  onError?: (responseError: any) => void;
  /**
   * Triggered when the data is fetched successfully.
   */
  onSuccess?: (response: any) => void;
};
