export const MakePropertyLowercase = (object) => {
  const data = {};

  Object.keys(object).forEach((key) => {
    const name = `${key.substr(0,1).toLowerCase() + key.substr(1)}`;
    data[name] = object[key];
  });

  return data;
}

