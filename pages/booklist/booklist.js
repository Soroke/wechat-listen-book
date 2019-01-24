// pages/booklist/booklist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist:[],
    booktype:"",
    showview: false,
    playstatus: false,
    playbookphoto: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载中遮罩
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var t=this
    if (options.booktype != undefined && options.soroke == undefined) {
      wx.request({
        url: 'https://www.soroke.cn/audio/getmorebook.do', // 仅为示例，并非真实的接口地址
        data: {
          pagenum: 1,
          pagesize: 100,
          type: options.booktype
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          t.setData({
            booklist: res.data.data,
            booktype: options.booktype
          })
          //请求成功去除加载状态
          wx.hideLoading()
        }
      })
    } else{
      wx.request({
        url: 'https://www.soroke.cn/audio/recommend.do', // 仅为示例，并非真实的接口地址
        data: {
          pagesize: 100,
          booktype: options.booktype
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          t.setData({
            booklist: res.data.data,
            booktype: options.booktype
          })
          //请求成功去除加载状态
          wx.hideLoading()
        }
      })
    }
  },

  /**
  * 跳转到播放页
  */
  playpage: function () {
    wx.navigateTo({
      url: '../playing/playing',
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
    if (wx.getBackgroundAudioManager().paused) {
      app.globalData.global_bac_audio_manager.playingStatus = false
    }
    this.setData({
      playstatus: app.globalData.global_bac_audio_manager.playingStatus,
      playbookphoto: app.globalData.global_bac_audio_manager.bookPhoto
    })
    if (!app.globalData.global_bac_audio_manager.bookid == "") {
      this.setData({
        showview: true
      })
    }
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

  }
})