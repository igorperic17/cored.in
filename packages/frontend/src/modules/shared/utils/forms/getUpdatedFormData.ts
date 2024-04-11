export const getUpdatedFormData = <T extends Record<string, unknown>>(
  original: T,
  updated: Partial<T>
): T => {
  let res = { ...original };
  (Object.keys(res) && Object.keys(updated)).forEach((key) => {
    res = { ...res, [key]: updated[key] !== undefined ? updated[key] : null };
  });

  return res;
};
