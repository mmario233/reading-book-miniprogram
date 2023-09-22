Page({
    data:{
      zhangHao:0,
      miMa:'',
    },
    // 获取账号
    getZhangHao(e){
      this.setData({
        zhangHao:e.detail.value
      })
      // console.log(this.data.zhangHao)
    },
    // 获取密码
    getMiMa(e){
      this.setData({
        miMa:e.detail.value
      })
    },
    // 注册
    zhuCe(){
      // 判断账号位数是否正确
      if(this.data.zhangHao.length!=11){
        wx.showToast({
          title: '手机号不正确',
          icon:'error'
        })
        return
      }
      // 判断密码位数是否正确
      if(this.data.miMa.length<2){
        wx.showToast({
          title: '密码不正确',
          icon:'error'
        })
        console.log('1')
        return
      }
      if(this.data.miMa.length>12){
        wx.showToast({
          title: '密码不正确',
          icon:'error'
        })
        // console.log('2')
        return
      }
      // 检查账号是否已经注册
      // var that=this
      // console.log('账号数据',this.data.zhangHao)
      wx.cloud.database().collection('user')
      .where({
        zhangHao:this.data.zhangHao
      })
      .get()
        // 成功
        .then(res=>{
          // console.log(res)
          if(res.data.length==0){
            console.log('未注册')
          // 上传数据库
          wx.cloud.database().collection('user')
          .add({
            data:{
              zhangHao:this.data.zhangHao,
              miMa:this.data.miMa,
              bookPage:0,
              nowPage:0,
              progress:0
            } 
          })
            .then(res=>{
              console.log('注册成功',res)
              wx.showToast({
                title: '注册成功',
              })
            })
            .catch(res=>{
              console.log('注册失败')
            })
          }
          else{
            console.log('已注册')
            wx.showToast({
              title: '重复注册',
              icon:'none'
            })
          }
        })
        .catch(err=>{
          
        })
       }
      })