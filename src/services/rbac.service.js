"use strict";

const { model } = require("mongoose");
const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

const createResource = async ({ name, slug, description = "" }) => {
  try {
    //1. Check name or slug exist    

    //2. new resource
    const resource = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  } catch (error) {
    throw error;
  }
};

const resourceList = async ({ limit = 30, page = 1, search = "" }) => {
  try {
    //1. check admin ? middleware func

    //2. get list of resource
    const resources = await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          createdAt: 1,
        },
      },
    ]);

    return resources;
  } catch (error) {
    throw error;
  }
};

const createRole = async ({ name, slug, description = "", grants = [] }) => {
  try {
    //1. check role exist

    //2. create role
    const role = await roleModel.create({
      role_name: name,
      role_slug: slug,
      role_description: description,
      role_grants: grants,
    });

    return role;
  } catch (error) {
    throw error;
  }
};

const roleList = async ({ limit = 30, page = 1, search = "" }) => {
  try {
    const roles = await roleModel.aggregate([
      {
        $unwind: "$role_grants", // chuyển array thành nhiều document
      },
      {
        $lookup: {
          from: "Resources",
          localField: "role_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          role: "$role_name",
          resource: "$resource.src_name",
          action: "$role_grants.actions",
          attributes: "$role_grants.attributes",
        },
      },
      {
        $unwind: "$action",
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: 1,
          attributes: 1,
        },
      },
    ]);

    return roles;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList,
};
