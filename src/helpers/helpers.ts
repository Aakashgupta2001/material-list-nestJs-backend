import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const generateRandomString = async (prefix, model, filter = {}) => {
  let modelCount = (await model.count(filter)) + 1;
  let result = `${prefix}-${modelCount}`;
  return result;
};
