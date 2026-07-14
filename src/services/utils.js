const trimObjItemValue = obj => {
  let newObj = obj instanceof Array ? [] : {};
  if (typeof obj === 'object') {
    return obj;
  } else {
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Array) {
        newObj[key] = trimObjItemValue(obj[key]);
      } else if (typeof obj[key] === 'string') {
        newObj[key] = obj[key].trim();
      } else {
        newObj[key] = obj[key];
      }
    });
  }
  return newObj;
};

export {
  trimObjItemValue
};
