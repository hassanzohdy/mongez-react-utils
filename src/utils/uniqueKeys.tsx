/**
 * Generate uniqueId for each array element
 */
export default function uniqueKeys(array: any[]) {
  return array.map((element) => {
    // check if the element is an object
    // if not an object, then wrap it in an object
    const obj = typeof element === "object" ? element : { value: element };

    return {
      ...obj,
      uniqueId: Math.random().toString(36).substring(2, 15),
    };
  });
}
