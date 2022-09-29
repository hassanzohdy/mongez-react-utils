import React from "react";

export type PreloadRequest = (props: any) => Promise<any>;

export type PreloadConfigurations = {
  loadingErrorComponent?: React.ComponentType;
  componentProps?: any;
};
