const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const Comment = db.collection("comment");
  let { OPENID } = cloud.getWXContext();
  try {
    var commentList = await Comment.where({
      _openid: OPENID
    }).get();
    return {
      state: true,
      message: "get comment list successed",
      data: commentList
    }
  } catch (e) {
    return {
      state: false,
      message: "get comment list failed",
      error_message: e
    }
  }
}