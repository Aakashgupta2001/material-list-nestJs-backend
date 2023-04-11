// mongodb queires global service

// create
export const create = async (model, body) => {
  return await model.create(body);
};

export const upsert = async (model, filter, body) => {
  return await model.findOneAndUpdate(
    filter,
    { $set: { ...body } },
    {
      new: true,
      upsert: true,
      runValidators: true,
      context: 'query',
      // runValidators:true,
    },
  );
};
export const update = async (model, filter, body) => {
  return await model.findOneAndUpdate(
    filter,
    { $set: { ...body } },
    {
      new: true,
      upsert: false,
      runValidators: true,
      context: 'query',
      // runValidators:true,
    },
  );
};

// find and filter
export const find = async (
  model,
  filter,
  projection = {},
  pagination = { skip: 0, limit: 0 },
  sort = {},
  populate = '',
) => {
  console.log(filter);
  return await model
    .find(filter, projection)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)
    .populate(populate);
};

export const findOne = async (
  model,
  filter,
  projection = {},
  populate = '',
) => {
  return await model.findOne(filter, projection).populate(populate);
};

export const countDocuments = async (model, filter) => {
  return await model.countDocuments(filter);
};

// updates
export const findOneAndUpdate = async (model, filter, body) => {
  return await model.findOneAndUpdate(filter, body, { new: true });
};

export const findOneAndUpsert = async (model, filter, body) => {
  return await model.findOneAndUpdate(filter, body, {
    new: true,
    upsert: true,
    runValidators: true,
    context: 'query',
    setDefaultsOnInsert: true,
  });
};

export const updateMany = async (model, filter, body) => {
  return await model.updateMany(filter, body, { new: true });
};

// delete
export const findOneAndSoftDelete = async (model, filter) => {
  return await model.findOneAndUpdate(filter, { active: false }, { new: true });
};

export const findOneAndHardDelete = async (model, filter) => {
  return await model.findOneAndDelete(filter);
};

export const deleteMany = async (model, filter) => {
  return await model.deleteMany(filter);
};

// aggregation
export const aggregate = async (model, query) => {
  return await model.aggregate(query);
};
