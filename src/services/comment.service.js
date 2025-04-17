"use strict";

const { NotFoundError } = require("../core/error.response");
const { Comment } = require("../models/comment.model");
const { convertToObjectIdMongo } = require("../utils");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");

      rightValue = parentComment.comment_right;
      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongo(productId),
          comment_right: { $gte: rightValue },
        },
        { $inc: { comment_right: 2 } }
      );

      await Comment.updateMany(
        {
          comment_productId: convertToObjectIdMongo(productId),
          comment_left: { $gt: rightValue },
        },
        { $inc: { comment_left: 2 } }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectIdMongo(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();

    return comment;
  }

  static async getCommentByParentId({
    productId,
    parentCommentId,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");

      const comments = await Comment.find({
        comment_productId: convertToObjectIdMongo(productId),
        comment_left: { $gt: parentComment.comment_left },
        comment_right: { $lt: parentComment.comment_right },
      })
        .sort({ comment_left: 1 })
        .limit(limit)
        .skip(offset);

      return comments;
    } else {
      const comments = await Comment.find({
        comment_productId: convertToObjectIdMongo(productId),
        comment_parentId: null,
      })
        .sort({ comment_left: -1 })
        .limit(limit)
        .skip(offset);

      return comments;
    }
  }

  static async deleteComment({ commentId, productId }) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    const width = rightValue - leftValue + 1;

    await Comment.deleteMany({
      comment_productId: convertToObjectIdMongo(productId),
      comment_left: { $gte: leftValue },
      comment_right: { $lte: rightValue },
    });

    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongo(productId),
        comment_left: { $gt: leftValue },
      },
      { $inc: { comment_left: -width } }
    );

    await Comment.updateMany(
      {
        comment_productId: convertToObjectIdMongo(productId),
        comment_right: { $gt: rightValue },
      },
      { $inc: { comment_right: -width } }
    );

    return true;
  }
}

module.exports = CommentService;
