var app=getApp()
Page({
  data:{
    list:{},
    bookPage:0
  },
  onLoad:function(e){
    // console.log(e.bookPage)
    app.globalData.bookPage=e.bookPage
    wx.cloud.database().collection('catalogue')
    .where({
      bookPage:parseInt(e.bookPage)
    })
    .get()
    .then(res=>{
      console.log('获取成功',res.data[0].catalog)
      this.setData({
        list:res.data[0].catalog
      })
    })
    .catch(err=>{
      console.log('获取失败',err)
    })
  },
  goDetail(e){
    console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/read/read?index='+e.currentTarget.dataset.index+'&bookPage='+app.globalData.bookPage,
    })
  }
})