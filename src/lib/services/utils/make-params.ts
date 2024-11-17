export const makeParams = (object: {
  [key: string]: boolean | string | undefined;
}): { [key: string]: string } => {
  const keys = Object.keys(object);
  const obj: { [key: string]: string } = {};

  for (const key of keys) {
    try {
      const value = object[key]?.toString();

      if (!value) continue;

      // @ts-ignore
      obj[key] = value;
    } catch (err) {
      console.error(err);
    }
  }

  return obj;
};
