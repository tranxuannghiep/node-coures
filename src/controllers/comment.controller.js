"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    console.log(`[P]::createComment`, req.body);

    new SuccessResponse({
      message: "Successfully comment",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };

  getCommentByParentId = async (req, res, next) => {
    console.log(`[P]::getCommentByParentId`, req.body);

    new SuccessResponse({
      message: "Successfully get comment",
      metadata: await CommentService.getCommentByParentId(req.query),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    console.log(`[P]::deleteComment`, req.body);

    new SuccessResponse({
      message: "Successfully delete comment",
      metadata: await CommentService.deleteComment(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
