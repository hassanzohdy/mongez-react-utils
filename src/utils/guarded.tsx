import React from "react";

/**
 * A component that renders its children only if the given condition is true.
 */
export default function guarded(
  Component: React.ComponentType<any>,
  guard: (props: any) => boolean
) {
  return function Guarded(props: any) {
    const output = guard(props);

    if (output !== true) {
      return output;
    }

    return <Component {...props} />;
  };
}
