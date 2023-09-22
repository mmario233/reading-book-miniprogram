
const getCommentList = require('./get_comment_list/index')
const getCommentDetail = require('./get_comment_detail/index')
// 云函数入口函数
exports.main = async (event, context) => {
  
var  type=event.type
  
  switch (type) {
    case 'get_comment_list':
      return await getCommentList.main(event, context);
    case 'get_comment_detail':
      return await getCommentDetail.main(event, context);
  }
}