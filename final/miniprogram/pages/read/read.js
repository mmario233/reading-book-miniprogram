var app = getApp()
var time=0;
var touchDot = 0;//触摸时的原点 
var interval = '';// 记录/清理时间记录
var m = ''; 
const db = wx.cloud.database()
Page({
  data: {
    book:"",
    title:"",
    Title:[],
    content:"",
    nowPage:0,
    _id:"",
    ztcolor:"#e5e7e8",
    scrollTop: 0,
    scrollTop1: 0,
    scrollWide: 0,
    fontSize:'12',
    zishu_sum:0,
    supper:[350,500,1500],
    lower:[150,300,800],
    mode:0,
    fl:0,
    sp:0,
    h:"00",
    m:"00",
    s:"00",
    // 修改文字颜色和背景色
    colorText: [{
      backgroundColor: '#e9dfc7',//浅黄色
      fontColor:'#000000'
    }, {
      backgroundColor: '#cdefce',//浅绿色
      fontColor:'#000000'
    }, {
      backgroundColor: '#000000',//黑色
      fontColor:'#e5e7e8'
    },{
      backgroundColor: '#e5e7e8',//白色
      fontColor:'#000000'
    }],
    nav:false,
    ziti:false,
    menu:false,
    _num:1,
    bodyColor:'#e9dfc7',
    textColor:'#000000',
    zj:false,
    brightness:0
  },
  onLoad: function (e) {
    console.log(e)
    app.globalData.nowPage=e.index
    app.globalData.bookPage=e.bookPage
    this.setData({
      nowPage:e.index
    })
    //console.log('onLoad')
    var that = this;
    that.queryTime()
    wx.showActionSheet({
      itemList: ["精读","正常","略读"],
      success: function (res) {
        console.log(res.tapIndex);
        that.setData({
          mode:res.tapIndex,
          fl:that.data.lower[res.tapIndex],
          sp:that.data.supper[res.tapIndex]
        })
      }
    })
    wx.getScreenBrightness({
      success: (res) => {
        console.log('获取亮度',res.value)
        that.setData({
          brightness:res.value
        })
      },
    })
    that.speed()
    //调用应用实例的方法获取全局数据
    var t = NaN;
    db.collection('readList')
    .where({
      bookPage:parseInt(e.bookPage)
    })
    .get({
      success:res=>{
        // console.log('获取成功',res.data[0].content[app.globalData.nowPage])
        // console.log('获取成功',res)
        app.globalData.progress=parseInt(res.data[0].num)
        that.setData({
          book:res.data[0].book,
          _id:res.data[0]._id,
          Title:res.data[0].title,
          title:res.data[0].title[app.globalData.nowPage],
          content:res.data[0].content[app.globalData.nowPage]
        })
        var _id=app.globalData.passZhangHao
        var t=parseInt(this.data.nowPage)
        var b=parseInt(app.globalData.bookPage)
        var p=100*(t+1)/parseInt(app.globalData.progress)
        wx.cloud.callFunction({
          name:'updateUser',
          data:{
            _id:_id,
          nowPage:t,
          bookPage:b,
          progress:p
          }
        })
        .then(res=>{
          console.log('更新数据成功',res)
        })
        .catch(err=>{
          console.log('更新失败',err)
        })
      }
    })
    // 本地提取字号大小
    var that = this;
    wx.getStorage({
      key: 'fontSize',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          fontSize: res.data
        })
      }
    })
    //获取背景色
    wx.getStorage({
      key: 'bodyColor',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          bodyColor: res.data
        })
      }
    })
    // 获取字体颜色
    wx.getStorage({
      key: 'textColor',
      success: function (res) {
        // console.log(res.data)
        that.setData({
          textColor: res.data
        })
      }
    })
  },

  //点击中间区域显示底部导航
  midaction:function(){
    if (this.data.nav==false){
      this.setData({
        nav:true
      })
    }else{
      this.setData({
        nav: false,
        ziti: false,
        menu:false
      })

    }
  },

  //点击目录出现窗口
  menuaction:function(){
    if (this.data.menu == false) {
      this.setData({
        menu:true
      })
      console.log(this.data.Title)
    } 
    else {
      this.setData({
        menu: false
      })
    }
    console.log(this.data.menu)
  },


  //点击字体出现窗口
  zitiaction:function(){
    if (this.data.ziti == false) {
      this.setData({
        ziti: true
      })
    } else {
      this.setData({
        ziti: false
      })
    }
  },

  //选择背景色
  changeColor(e){
    // console.log(e.target.dataset.index)
    //console.log('222',e)
    this.setData({
      bodyColor: this.data.colorText[e.target.dataset.index].backgroundColor,
      textColor: this.data.colorText[e.target.dataset.index].fontColor
    })
    // 储存背景色
    wx.setStorage({
      key: "bodyColor",
      data: this.data.colorText[e.target.dataset.index].backgroundColor
    })
    // 储存字体颜色
    wx.setStorage({
      key:'textColor',
      data:this.data.colorText[e.target.dataset.index].fontColor
    })
  },

  // 改变亮度
  liangDu(e){
    console.log(e.detail.value)
    this.setData({
      brightness:e.detail.value
    })
    var that=this
    wx.setScreenBrightness({
      value: that.data.brightness,
    })
  },

  //滚动
  bindscroll:function(e){
    //console.log(e.detail)
    
      this.setData({
      scrollTop:e.detail.scrollTop,
      scrollWide:e.detail.scrollWidth,
      nav: false,
      ziti: false,
      menu: false,
      zj:false
    })
    
    
  },


  //滚动到底部
  bindscrolltolower:function(){
    this.setData({
      zj: true,
    })
  },

  //上一页
  lastPage:function(){
    console.log(this.data.nowPage)
    if(this.data.nowPage>0){
      var _id=app.globalData.passZhangHao
      var t=parseInt(this.data.nowPage)-1
      var b=parseInt(app.globalData.bookPage)
      var p=100*(t+1)/parseInt(app.globalData.progress)
      
      wx.cloud.callFunction({
        name:'updateUser',
        data:{
          _id:_id,
          nowPage:t,
          bookPage:b,
          progress:p
        }
      })
      .then(res=>{
        console.log('更新成功',res)
        db.collection('readList')
        .where({
          bookPage:parseInt(b)
        })
        .get()
        .then(res=>{
          console.log(res.data[0].content[t])
          this.setData({
            title:res.data[0].title[t],
            content:res.data[0].content[t],
            scrollTop1:0,
            nowPage:t
          })
        })
        .catch(err=>{
          console.log(err)
        })
      })
      .catch(err=>{
        console.log('更新失败',err)
      })
    }
    else {
      wx.showToast({
        title: '没有上一章了',
        icon:'error',
        duration:2000
      })
    }
  },

  //下一页
  nextPage:function(){
    if(this.data.nowPage<10){
      var m = this.data.zishu_sum;
      var _id=app.globalData.passZhangHao
      var t=parseInt(this.data.nowPage)+1
      var b=app.globalData.bookPage
      var p=100*(t+1)/parseInt(app.globalData.progress)
      wx.cloud.callFunction({
        name:'updateUser',
        data:{
          _id:_id,
          nowPage:t,
          bookPage:b,
          progress:p
        }
      })
      .then(res=>{
        console.log('更新成功',res)
        db.collection('readList')
        .where({
          bookPage:parseInt(b)
        })
        .get()
        .then(res=>{
          // console.log(res.data[0].content[t])
          this.setData({
            title:res.data[0].title[t],
            content:res.data[0].content[t],
            zishu_sum:res.data[0].size[t-1]+m,
            scrollTop1:0,
            nowPage:t
          })
        })
        .catch(err=>{
          console.log(err)
        })
      })
      .catch(err=>{
        console.log('更新失败',err)
      })
    }
    else {
      wx.showToast({
        title: '没有下一章了',
        icon:'error',
        duration:2000
      })
    }
  },

  // 修改字号
  ziHao(e){
    console.log('2222',e.detail.value)
    this.setData({
      fontSize:e.detail.value
    })
    var that=this
    wx.setStorage({
      key:'fontSize',
      data:that.data.fontSize
    })
  },

  //计时器
  queryTime(){
    const that = this;
    var hour = that.data.h;
    var min = that.data.m;
    var sec = that.data.s;
    var tim = 0;
    setInterval(function(){
      tim++
      if(tim >= 10){
      tim = 0
      sec++
      if(sec >= 60){
        sec = 0
        that.setData({
          s:(sec < 10 ? '0' + sec : sec)
        })
        min++
        if(min >= 60){
          min = 0
          that.setData({
            m:(min <10 ? '0' + min : min)
          })
          hour++
          that.setData({
            h:(hour < 10 ? '0' + hour : hour)
          })
        }
        else{
          that.setData({
            m:(min <10 ? '0' + min : min)
          })
        }
      }
      else{
        that.setData({
          s:(sec < 10 ? '0' + sec : sec)
        })
      }
      }
    },100)
  },

  //未触摸计时
  bindtouchstart: function (e) {
    clearInterval(interval)
    time = 0;
    //console.log(time)
  },
  bindtouchend: function (e) {
  interval = setInterval(function(){
    time++
    if(time >= 10){
      //console.log(time)
      wx.showToast({
        title: '您还在屏幕前吗？',
        icon:'error'
      })
      clearInterval(interval)
    }
  },1000)
  var that = this;
  },
  //阅读速度计算
  speed(){
    var that = this;
    var t = 0;
      m = setInterval(function(){
        var scrolltop = that.data.scrollTop; 
        var scrollwide = that.data.scrollWide;
        var size = that.data.fontSize;
        var fl = that.data.fl;
        var sp = that.data.sp;
        var zs = that.data.zishu_sum;
        var min = that.data.m;
        var sum = 0; 
        t++
        //console.log(t)
        sum = Math.floor(scrolltop/30) * Math.floor(scrollwide/size) + zs;
        if (min >= 1 && t % 3 == 0){
       if (Math.floor(sum/min) > sp){
         wx.showModal({
           content: `您太快了,每分钟高于${sp}字,您现在的速度为每分钟${Math.floor(sum/min)}字`,
           icon:'error'
         })
         that.setData({
          ztcolor:"#ff0000"
        })
       }
       else if(Math.ceil(sum/min) < fl){
        wx.showModal({
          content: `您太慢了,每分钟低于${fl}字,您现在的速度为每分钟${Math.ceil(sum/min)}字`,
          icon:'error'
        })
        that.setData({
          ztcolor:"#ff7f00"
        })
       }
      else {
        that.setData({
          ztcolor:"#00d8a0"
        })
      }
    }
      // console.log(sum)
    },20000)
    
  },
  onHide:function(){
    console.log('页面走了onHide');
    clearInterval(m)
    clearInterval(interval)
  },
  onUnload:function(){
    clearInterval(m)
    clearInterval(interval)
  },
  toDetail(e){
    console.log(e.currentTarget.dataset.index)
    var k = e.currentTarget.dataset.index;
    var _id=app.globalData.passZhangHao
      var b=app.globalData.bookPage
      var p=100*(k+1)/parseInt(app.globalData.progress)
      wx.cloud.callFunction({
        name:'updateUser',
        data:{
          _id:_id,
          nowPage:k,
          bookPage:b,
          progress:p
        }
      })
      .then(res=>{
        console.log('更新成功',res)
        db.collection('readList')
        .where({
          bookPage:parseInt(b)
        })
        .get()
        .then(res=>{
          // console.log(res.data[0].content[t])
          this.setData({
            title:res.data[0].title[k],
            content:res.data[0].content[k],
            scrollTop1:0,
            nowPage:k
          })
        })
        .catch(err=>{
          console.log(err)
        })
      })
      .catch(err=>{
        console.log('更新失败',err)
      })
  }
})
