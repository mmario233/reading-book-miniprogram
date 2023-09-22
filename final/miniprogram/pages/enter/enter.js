const app=getApp()
Page({
  data:{
    zhangHao:0,
    miMa:0
  },
  // 获取账号
  getZhangHao(e){
    this.setData({
      zhangHao:e.detail.value
    })
  },
  // 获取密码
  getMima(e){
    this.setData({
      miMa:e.detail.value
    })
  },
  // 登录
  logIn(){
    // 从数据库获取账号和密码
    wx.cloud.database().collection('user')
    .where({
      zhangHao:this.data.zhangHao
    })
    .get()
    .then(res=>{
      console.log('获取成功',res.data[0])
      // 获取密码与输入密码进行比较
    if(this.data.miMa==res.data[0].miMa){
      wx.switchTab({
        url: '/pages/home page/home page',
      })
      app.globalData.passZhangHao=res.data[0]._id
      app.globalData.bookPage=res.data[0].bookPage
      app.globalData.nowPage=res.data[0].nowPage
      app.globalData.progress=res.data[0].progress
      // console.log(app.globalData.passZhangHao)
     }
     if(this.data.miMa!=res.data[0].miMa){
       console.log(this.data.secret,this.data.miMa) 
       wx.showToast({
         title: '手机号或密码错误',
         icon:'error'
       })
     }
    })
    .catch(err=>{
      console.log('获取失败')
    })
  }
})