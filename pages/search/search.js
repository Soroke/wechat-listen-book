// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookinfo: [],
    showview: false,
    playstatus: false,
    playbookphoto: ""
  },

  searchbook: function (e) {
    wx.showNavigationBarLoading()
    this.searchAudio(e.detail.value)
    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  },

  /**
   * 音频搜索接口
   */
  searchAudio(key) {
    //加载中遮罩
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var t = this
    wx.request({
      url: 'https://www.soroke.cn/audio/search.do', // 仅为示例，并非真实的接口地址
      data: {
        keyword: key
      },

      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //请求成功去除加载状态
        wx.hideLoading()
        t.setData({ bookinfo: res.data.data })
        console.log(res.data)

      },
      fail(res) {
        console.log(res.data)
      }
    })
  },

  /**
  * 跳转到播放页
  */
  playpage: function () {
    wx.navigateTo({
      url: '../playing/playing',
    })
  },
})