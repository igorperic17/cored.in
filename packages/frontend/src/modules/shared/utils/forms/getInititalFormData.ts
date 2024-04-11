export const getInitialFormData = <T extends Record<string, unknown>>(
  original: T
): Partial<T> => {
  let res: Partial<T> = {};
  Object.entries(original).forEach(([key, value]) => {
    if (value) {
      res = { ...res, [key]: value };
    }
  });

  return res;
};
