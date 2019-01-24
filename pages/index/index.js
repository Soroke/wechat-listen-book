// pages/souye/souye.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    hotbookRecom: [],
    newbookRecom: [],
    audioStory: [],
    crosstalkBook: [],
    bookimage:"",
    showview: false,
    playstatus: false
  },

  /**
   * 跳转到搜索页
   */
  search: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  /**
   * 跳转到播放页
   */
  playpage: function() {
    wx.navigateTo({
      url: '../playing/playing',
    })
  },
  /**
   * 换一批
   */
  change: function() {
    this.loading()
    this.getrecommend()
    this.stoploading()
  },

  tiaozhuan: function(e) {
    var booktype=e.currentTarget.dataset.booktype
    var bookid=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../bookinfo/bookinfo?bookid=' + bookid + '&booktype=' + booktype
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t=this
    if (!app.globalData.global_bac_audio_manager.bookid == "") {
    }
    this.setData({
      bookimage: app.globalData.global_bac_audio_manager.bookPhoto,
      playstatus: app.globalData.global_bac_audio_manager.playingStatus
    })
    this.loading()
    this.getindex()
    this.getbanner()
    this.getrecommend()
    //存在记录时获取书籍的播放列表
    if (app.globalData.global_bac_audio_manager.bookid != undefined && app.globalData.global_bac_audio_manager.booktype != undefined) {
      wx.request({
        url: 'https://www.soroke.cn/audio/bookaudiolist.do', // 仅为示例，并非真实的接口地址
        data: {
          booktype: app.globalData.global_bac_audio_manager.booktype,
          bookid: app.globalData.global_bac_audio_manager.bookid
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          app.globalData.playingbooklist = res.data.data
          t.stoploading()
        }
      })
    }
    
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
      bookimage: app.globalData.global_bac_audio_manager.bookPhoto,
      playstatus: app.globalData.global_bac_audio_manager.playingStatus
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
    wx.showNavigationBarLoading()

    this.getindex()
    this.getbanner()
    this.getrecommend()
    //隐藏动画
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()

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

  getbanner() {
    var t = this
    wx.request({
      url: 'https://www.soroke.cn/audio/getbanner', // 仅为示例，并非真实的接口地址
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        t.setData({
          banner: res.data.data
        })
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
   * 获取首页数据
   */
  getindex() {

    var t = this
    var ap = app
    wx.request({
      url: 'https://www.soroke.cn/audio/index', // 仅为示例，并非真实的接口地址
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        ap.globalData.audioStory1 = res.data.data.audioStory
        //设置获取数据
        t.setData({
          newbookRecom: t.edit([res.data.data.newRecom[0], res.data.data.newRecom[1], res.data.data.newRecom[2]]),
          audioStory: t.edit(res.data.data.audioStory),
          crosstalkBook: t.edit(res.data.data.crosstalkBook)
        })
        console.log(res.data)
      },
      fail(res) {
        console.log(res.data)
      }
    })
  },
  /**
* 获取推荐图书
*/
  getrecommend() {
    var t = this
    wx.request({
      url: 'https://www.soroke.cn/audio/index_recommend', // 仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        t.setData({
          hotbookRecom: res.data.data
        })
      }
    })
  },

/**
 * 修改书籍名称过长
 */
  edit(book) {
    var t=this;
    for (var i = 0; i < book.length; i++) {
      if (book[i].bookName.length >=8) {
        book[i].bookName = book[i].bookName.substring(0, 8) + "...";
      }
    }
    return book
  },
})