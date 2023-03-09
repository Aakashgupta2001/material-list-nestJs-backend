import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const generateRandomString = async (prefix, model, filter = {}) => {
  let modelCount = (await model.count(filter)) + 1;
  let result = await genUid(prefix, model, filter, modelCount);

  return result;
};

const genUid = async (prefix, model, filter, modelCount) => {
  let result = `${prefix}-${modelCount}`;
  let lastEntry = await model
    .find(filter)
    .limit(1)
    // .filter(filter)
    .sort({ $natural: -1 });
  console.log(lastEntry);
  if (lastEntry.length !== 0)
    result = `${prefix}-${+lastEntry[0].uid.split('-')[1] + 1}`;
  return result;
};
