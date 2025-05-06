import _ from 'lodash';

interface Obj {
  [key: string]: any;
}

function removeEmptyFields(data: { [key: string]: any }) {
  Object.keys(data).forEach((key: string) => {
    if (data[key] === '' || data[key] == null) {
      delete data[key];
    }
  });
}

export function dataToFormHandler(data: object) {
  const formData = new FormData();
  removeEmptyFields(data);
  Object.entries(data).forEach(([key, val]) => {
    if (key === 'images') return;
    if (key.includes('OfContract')) {
      formData.append(key, (val as Date).toISOString());
      return;
    }

    formData.append(key, val as any);
  });

  if ('images' in data && (data.images as File[])?.length)
    (data.images as File[]).forEach((file: File) => {
      formData.append('images', file);
    });

  return formData;
}

export function getUpdatedKeys(obj1: Obj, obj2: Obj, rejectedKeys?: string[]): Obj {
  return _.omitBy(
    obj2,
    (value, key) =>
      _.isEqual(value, obj1[key]) ||
      value === null ||
      obj1[key] === null ||
      (rejectedKeys ?? []).includes(key)
  );
}

export function splitCamelCase(word: string): string {
  return word.replace(/([a-z])([A-Z])/g, '$1 $2');
}
