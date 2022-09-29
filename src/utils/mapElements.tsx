import React from "react";
import uniqueKeys from "./uniqueKeys";

/**
 * Loop over the given array and render the given component for each element in the array.
 */
export default function mapElements(
  data: any[],
  Component: React.ElementType,
  as: string | ((item: any, index: number) => object) = "item"
): React.ReactNode {
  return uniqueKeys(data).map((item: any, index: number) => {
    const props =
      typeof as === "string" ? { [as]: item, index } : as(item, index);
    return <Component key={item.uniqueId} {...props} />;
  });
}
