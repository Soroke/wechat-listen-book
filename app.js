//app.js
App({
  globalData: {
    userInfo: null,
    global_bac_audio_manager: {
      bookid:"",
      booktype:"",
      index:"",
      bookname: "",
      bookPhoto:"",
      hostName:"",
      audioname: "",
      audiotime:0,
      //当前音频播放到的时间
      nowtime:0,
      playingStatus:false,
    },
    playingbooklist:[],
    //定时关闭
    close: -1,
    //片头跳过时长
    spiktime: 0,
  },
  onLaunch: function () {
    var t=this
    var bookid=""
    var booktype=""
    wx.getStorage({
      key: 'bookid',
      success(res) {
          t.globalData.global_bac_audio_manager.bookid = res.data
          bookid = res.data
          console.log(`缓存中书籍ID为：`, res.data)
      }
    })
    wx.getStorage({
      key: 'booktype',
      success(res) {
          t.globalData.global_bac_audio_manager.booktype = res.data
        booktype = res.data
          console.log(`缓存中书籍类型为：`, res.data)
      }
    })
    wx.getStorage({
      key: 'index',
      success(res) {
          t.globalData.global_bac_audio_manager.index = res.data
          console.log(`缓存中播放集数为：`, res.data)

      }
    })
    wx.getStorage({
      key: 'bookname',
      success(res) {
          t.globalData.global_bac_audio_manager.bookname = res.data
          console.log(`缓存中书籍名称为：`, res.data)
      }
    })
    wx.getStorage({
      key: 'bookPhoto',
      success(res) {
          t.globalData.global_bac_audio_manager.bookPhoto = res.data
          console.log(`缓存中书籍照片为：`, res.data)

      }
    })
    wx.getStorage({
      key: 'hostName',
      success(res) {
          t.globalData.global_bac_audio_manager.hostName = res.data
          console.log(`缓存中播讲人为：`, res.data)
      }
    })
    wx.getStorage({
      key: 'playingaudioName',
      success(res) {
        t.globalData.global_bac_audio_manager.audioname = res.data
        console.log(`缓存中背景音频名称：`, res.data)
      }
    })
    wx.getStorage({
      key: 'playingaudioTime',
      success(res) {
        t.globalData.global_bac_audio_manager.audiotime = res.data * 1
        console.log(`缓存中背景音频长度：`, res.data)
      }
    })
    wx.getStorage({
      key: 'spikTime',
      success(res) {
        t.globalData.spiktime = res.data * 1
        console.log(`缓存中音频的跳过时长为：`, res.data)
      }
    })
  },
})
