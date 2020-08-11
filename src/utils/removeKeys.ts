export const removeKeys = <T>(original: T, keys: (keyof T)[]): T =>
  Object.keys(original).reduce(
    (copy, key) =>
      keys.includes(key as keyof T)
        ? copy
        : { ...copy, [key]: original[key as keyof T] },
    {},
  ) as T;
