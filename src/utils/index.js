"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const selectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });

  return obj;
};

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined || obj[k] === null) return;

    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};

const convertToObjectIdMongo = (id) => new Types.ObjectId(id);

module.exports = {
  getInfoData,
  selectData,
  unSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongo,
};
