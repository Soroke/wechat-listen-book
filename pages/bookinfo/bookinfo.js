// pages/bookinfo/bookinfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookID: "",
    bookType: "",
    bookName: "",
    bookPhoto: "",
    hostName: "",
    makeName: "",
    typeId: "",
    playNum:"",
    playlist: [],
    showview: false,
    playstatus: false,
    playbookphoto: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loading()
    this.setData({
      bookID: options.bookid,
      bookType: options.booktype,
    })
    this.getbookinfo(options.booktype, options.bookid)
    this.getbookaudiolist(options.booktype, options.bookid)
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
 * 获取书籍信息
 */
  getbookinfo(booktype,bookid) {
    var t = this
    
    wx.request({
      url: 'https://www.soroke.cn/audio/bookinfo.do', // 仅为示例，并非真实的接口地址
      data: {
        booktype: booktype,
        bookid: bookid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        t.setData({
          bookName: t.edit(res.data.data.bookName),
          bookPhoto: res.data.data.bookPhoto,
          hostName: res.data.data.hostName,
          makeName: res.data.data.makeName,
          typeId: res.data.data.typeId,
          playNum: res.data.data.playNum
        })
      }
    })
    
  },

  /**
   * 获取书籍播放列表
   */
  getbookaudiolist(booktype, bookid) {
    var t = this
    this.loading()
    wx.request({
      url: 'https://www.soroke.cn/audio/bookaudiolist.do', // 仅为示例，并非真实的接口地址
      data: {
        booktype: booktype,
        bookid: bookid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        app.globalData.playingbooklist = res.data.data
        t.setData({
          playlist: res.data.data
        })
        t.stoploading()
      }
    })
    
  },

  loading() {
    //加载中遮罩
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
  },

  stoploading() {
    //请求成功去除加载状态
    wx.hideLoading()
  },
  /**
   * 修改书籍名称过长
   */
  edit(bookName) {
    var t = this;
    if (bookName.length >= 8) {
        bookName = bookName.substring(0, 8) + "...";
    }
    return bookName
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