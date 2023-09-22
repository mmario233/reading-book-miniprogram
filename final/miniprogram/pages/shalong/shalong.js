// pages/shalong/shalong.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookName:"",
    comment:"",
    div:"",
    comment_list:[],
    click:false
  },
  btnSub(res){
    
    var bookName=res.detail.value.bookName;
    var comment = res.detail.value.comment;
    var div= res.detail.value.div;
    db.collection("comment").add({
      data:{
        bookName:bookName,
        comment:comment,
        div:div
      }
    }).then(res=>{
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载。。。',
    })
    let that = this;

    wx.cloud.callFunction({
      name:"comment_controller",
      data:{
        type:"get_comment_list"
      }
    }).then(resp => {
      console.log(resp)
      that.setData({
        comment_list:resp.result.data.data
      })
      wx.hideLoading({
      })
      })
    .catch(error => {
      console.log(error)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在加载。。。',
    })
    let that = this;

    wx.cloud.callFunction({
      name:"comment_controller",
      data:{
        type:"get_comment_list"
      }
    }).then(resp => {
      console.log(resp)
      that.setData({
        comment_list:resp.result.data.data
      })
      wx.hideLoading({
      })
      })
    .catch(error => {
      console.log(error)
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  to_detail(e) {
    console.log(e)
    let _id = e.currentTarget.id;
    wx.navigateTo({
      url: `/pages/shalong_detail/shalong_detail?id=${_id}`,
    })
  },
  bindChange(){
    let that = this;
    if(that.click==false){
      that.click=true
    }
    else{
      that.click=false
    }
    console.log(that.click)
  }
})