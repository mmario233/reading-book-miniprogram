const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

exports.main = async (event, context) => {
  const Comment = db.collection("comment");
  console.log(event)
  try {
    var getCommentDetail = await Comment.doc(event._id).get();
    return {
      state: true,
      message: "get comment list successed",
      data: getCommentDetail
    }
  } catch (e) {
    return {
      state: false,
      message: "get comment list failed",
      error_message: e
    }
  }
}