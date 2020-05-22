// components/authorizationLogin/authorization.js
//获取应用实例
const app = getApp()
const gdata = app.globalData
const api = app.globalData.api

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 后台授权登录
    async userLogin(info) {
      wx.setStorageSync('wxNickName', info.nickName)
      let data = {
        UserInfo:1,
        nickName: info.nickName,
        avatarUrl: info.avatarUrl,
        gender: info.gender
      }
      let res = await api.postData('wxapi/v1/user.php?type=update', data)
      //用户按了允许授权按钮
      this.triggerEvent('loginsuccess')
    },
    //授权绑定
    bindGetUserInfo: function (e) {
      let info = e.detail.userInfo
      if (e.detail.userInfo) {
        wx.login({
          success: async res => {
            await this.userLogin( info )
          }
        })
      }
    },
   
  }
})
