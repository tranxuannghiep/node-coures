const { unSelectData } = require("../../utils");

const findAllDiscountCodesUnSelect = async ({
  limit,
  sort,
  page,
  filter,
  unSelect,
  model,
}) => {
  const skip = (Number(page) - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectData(unSelect))
    .lean();

  return documents;
};

const checkDiscountExist = async ({ model, filter }) => {
  const fountDocuments = await model.findOne(filter).lean();
  return fountDocuments;
};

module.exports = {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
};
