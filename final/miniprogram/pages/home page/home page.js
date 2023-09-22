const db = wx.cloud.database();
var app=getApp()
Page({
  data: {
    nowPage:0,
    bookPage:0,
    book:"",
    h:"00",
    m:"00",
    s:"00",
    author:"",
    pro:0
  },
  onShow: function (options) {
    wx.cloud.database().collection('user')
    .where({
      _id:app.globalData.passZhangHao
    })
    .get()
    .then(res=>{
      console.log('获取进度成功',res)
      app.globalData.progress=res.data[0].progress
      this.setData({
        bookPage:app.globalData.bookPage,
        nowPage:app.globalData.nowPage,
        pro:parseInt(app.globalData.progress)
      })
    })
    .catch(err=>{
      console.log('获取进度失败',err)
    })
  },
  goRead(){
    wx.navigateTo({
      url: '/pages/read/read?bookPage='+this.data.bookPage+'&index='+this.data.nowPage,
    })
  }
})