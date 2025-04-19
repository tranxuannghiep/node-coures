"use strict";

const { Notification } = require("../models/notification.model");

const pushNotiToSystem = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let noti_content;

  if (type === "SHOP-001") {
    noti_content = "@@@ vừa mới thêm 1 sản phẩm: @@@@";
  } else if (type === "PROMOTION-001") {
    noti_content = "@@@ vừa mới thêm 1 voucher: @@@@";
  }

  const newNoti = await Notification.create({
    noti_type: type,
    noti_senderId: senderId,
    noti_receiverId: receivedId,
    noti_content,
    noti_options: options,
  });

  return newNoti;
};

module.exports = {
  pushNotiToSystem,
};
