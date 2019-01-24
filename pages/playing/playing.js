// pages/playing/playing.js
var util = require('../../utils/util.js')
const app = getApp()
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({
  data: {
    //播放暂停按钮状态
    pauseStatus: true,
    //定时开关信息
    array: ['一集后', '二集后', '三集后', '四集后', '五集后'],
    //书籍信息
    bookinfo: {
      bookID: "",
      bookType: "",
      bookName: "",
      index: "",
      bookPhoto: "",
      hostName: "",
      audioname: "",
      audiotime:0,
    },
    //音频总时长
    formatAudioTime:"00:00",
    //当前时长
    formatAudioNowTime: "00:00",
    //当前时长
    audioNowTime:0,
    //底部弹出层状态
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//
    toView:'list-0',
    //弹出层list
    audiolist:[],
    //弹出框状态
    hiddenmodalput:true,
    //跳过的值
    spiktime:0,
  },

  onLoad: function (options) {

    this.playaudio(options)
    /**
     * 自然播放结束后的处理
     */
    backgroundAudioManager.onEnded(() => {
      console.log(app.globalData.close)
      app.globalData.global_bac_audio_manager.nowtime=0
      if (app.globalData.close === -1) {
        this.bindTapNext()
      } else{
        if (app.globalData.close === 0) {
          app.globalData.global_bac_audio_manager.playingStatus = false
          app.globalData.close = -1
          this.setData({pauseStatus: true})
        } else {
          app.globalData.close = app.globalData.close - 1
          this.bindTapNext()
        }
      }
    }),
    /**
     * 时间更新时间
     */
    backgroundAudioManager.onTimeUpdate(() => {
      this.setData({
        audioNowTime: backgroundAudioManager.currentTime *1,
        formatAudioNowTime: util.formatTime(backgroundAudioManager.currentTime * 1)
      })
      app.globalData.global_bac_audio_manager.nowtime = backgroundAudioManager.currentTime * 1
    }),
    /**
     * iOS系统界面下一集处理
     */
    backgroundAudioManager.onNext(() => {
      this.bindTapNext()
    })
     /**
     * iOS系统界面上一集处理
     */
    backgroundAudioManager.onPrev(() => {
      this.bindTapPrev()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //页面显示时设置背景音频的进度条，解决暂停状态进入进度条显示为0
    this.setData({
      audioNowTime: backgroundAudioManager.currentTime * 1,
      formatAudioNowTime: util.formatTime(backgroundAudioManager.currentTime * 1),
      spiktime: app.globalData.spiktime
    })
    //页面显示时检查是否为暂停状态
    if(backgroundAudioManager.paused){
      this.setData({ pauseStatus: true})
      app.globalData.global_bac_audio_manager.playingStatus = false
    }
    if (app.globalData.playingbooklist === []) {
      //加载中遮罩
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
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
   * 请求播放音频
   */
  playaudio: function (options) {
    //检查当前没有有正在播放的背景音频   或者有正在播放音频但是有传入参数时，请求接口设置新的音频播放
    if (wx.getBackgroundAudioManager().src == undefined || options.bookid != undefined) {
      this.loading()
      //检查当前传入参数为空时，使用app.js中的音频信息设置音频播放
      if (options.bookid == undefined) {
        //设置播放列表数据
        this.setaudiolist(app.globalData.global_bac_audio_manager.index)
        //根据app.js中的值设置本地的书籍播放信息
        this.setData({
          bookinfo: {
            bookID: app.globalData.global_bac_audio_manager.bookid,
            bookType: app.globalData.global_bac_audio_manager.booktype,
            bookName: app.globalData.global_bac_audio_manager.bookname,
            index: app.globalData.global_bac_audio_manager.index,
            bookPhoto: app.globalData.global_bac_audio_manager.bookPhoto,
            hostName: app.globalData.global_bac_audio_manager.hostName,
            audioname: app.globalData.global_bac_audio_manager.audioname,
            audiotime: app.globalData.global_bac_audio_manager.audiotime,
          },
          formatAudioTime: util.formatTime(app.globalData.global_bac_audio_manager.audiotime)
        })
        //根据app.js中的值设置本地的书籍播放信息请求并设置背景音频的src
        this.getaudiosrc(this.data.bookinfo.bookType, this.data.bookinfo.bookID, this.data.bookinfo.index, this.data.bookinfo.bookName + '-' + this.data.bookinfo.audioname, this.data.bookinfo.bookPhoto)
        //记录播放信息到缓存
        this.huancun(this.data.bookinfo.bookType, this.data.bookinfo.bookID, this.data.bookinfo.index, this.data.bookinfo.bookName, this.data.bookinfo.bookPhoto, this.data.bookinfo.hostName, this.data.bookinfo.audioname, this.data.bookinfo.audiotime)
        wx.setNavigationBarTitle({
          title: app.globalData.global_bac_audio_manager.bookname  //修改title
        })
        //当前传入参数不为空时
      } else {
        //设置播放列表数据
        this.setaudiolist(options.index)
        //根据传入信息设置当前页面的书籍播放信息
        this.setData({
          bookinfo: {
            bookID: options.bookid,
            bookType: options.booktype,
            bookName: options.bookName,
            index: options.index,
            bookPhoto: options.bookPhoto,
            hostName: options.hostName,
            audioname: options.audioname,
            audiotime: options.audiotime *1,
          },
          formatAudioTime: util.formatTime(options.audiotime *1)
        })
        //使用传入参数请求接口并设置背景音频的src
        this.getaudiosrc(options.booktype, options.bookid, options.index, options.bookName + '-' + options.audioname, options.bookPhoto)
        //记录缓存
        this.huancun(options.booktype, options.bookid, options.index, options.bookName, options.bookPhoto, options.hostName, options.audioname, options.audiotime)
        //修改系统app.js中的值
        app.globalData.global_bac_audio_manager.bookid = options.bookid
        app.globalData.global_bac_audio_manager.booktype = options.booktype
        app.globalData.global_bac_audio_manager.bookname = options.bookName
        app.globalData.global_bac_audio_manager.bookPhoto = options.bookPhoto
        app.globalData.global_bac_audio_manager.audioname = options.audioname
        app.globalData.global_bac_audio_manager.hostName = options.hostName
        app.globalData.global_bac_audio_manager.index = options.index
        app.globalData.global_bac_audio_manager.audiotime = options.audiotime * 1
        wx.setNavigationBarTitle({
          title: options.bookName  //修改title
        })
      }
      //当前有正在播放的视频且传入参数为空时
    } else {
      this.setaudiolist(app.globalData.global_bac_audio_manager.index)
      //设置当前播放页的书籍名称、图片、音频名称、播讲人信息
      this.setData({
        bookinfo: {
          bookID: app.globalData.global_bac_audio_manager.bookid,
          bookType: app.globalData.global_bac_audio_manager.booktype,
          bookName: app.globalData.global_bac_audio_manager.bookname,
          index: app.globalData.global_bac_audio_manager.index,
          bookPhoto: app.globalData.global_bac_audio_manager.bookPhoto,
          hostName: app.globalData.global_bac_audio_manager.hostName,
          audioname: app.globalData.global_bac_audio_manager.audioname,
          audiotime: app.globalData.global_bac_audio_manager.audiotime,
        },
        formatAudioTime: util.formatTime(app.globalData.global_bac_audio_manager.audiotime)
      })
      //根据已有背景音频的播放状态设置当前页面的播放按钮和图片的状态
      if (app.globalData.global_bac_audio_manager.playingStatus) {
        this.setData({
          pauseStatus: false
        })
      }

      wx.setNavigationBarTitle({
        title: app.globalData.global_bac_audio_manager.bookname  //修改title
      })
    }

  },

  /**
   * 拖动滚动条事件处理
   */
  seek: function (e) {
    backgroundAudioManager.seek(e.detail.value * 1)
  },

  /**
   * 设置定时停止播放
   */
  bindPickerChange: function(e) {
    wx.showToast({
      title: '设置成功，' + (e.detail.value * 1 + 1) + '集后停止播放',
      icon: 'none',
      duration: 2000
    })
    app.globalData.close = e.detail.value * 1 + 1
  },

  /**
   * 监听上一集
   */
  bindTapPrev: function() {
    var booklist = app.globalData.playingbooklist
    for (var i = 0; i < booklist.length; i++) {
      if (booklist[i].epis == 0) {
        wx.showToast({
          title: '已经是第一集',
          icon: 'none',
          duration: 2000
        })
      } else{
        if (booklist[i].zname == app.globalData.global_bac_audio_manager.audioname) {
          var options = {
            bookid: app.globalData.global_bac_audio_manager.bookid,
            booktype: app.globalData.global_bac_audio_manager.booktype,
            index: booklist[i - 1].epis,
            bookPhoto: app.globalData.global_bac_audio_manager.bookPhoto,
            hostName: app.globalData.global_bac_audio_manager.hostName,
            bookName: app.globalData.global_bac_audio_manager.bookname,
            audioname: booklist[i-1].zname,
            audiotime: booklist[i-1].timesize * 1,
          }
          this.playaudio(options)
          break; 
        }
      }
    }
  },
  /**
   * 监听下一集
   */
  bindTapNext: function () {
    var booklist = app.globalData.playingbooklist
    for (var i = 0; i < booklist.length; i++) {
      if (i == booklist.length-1) {
        wx.showToast({
          title: '已经是最后一集',
          icon: 'none',
          duration: 2000
        })
        backgroundAudioManager.stop();
        app.globalData.global_bac_audio_manager.playingStatus = false
        this.setData({ pauseStatus: true });
      } else {
        if (booklist[i].zname == app.globalData.global_bac_audio_manager.audioname) {
          var options = {
            bookid: app.globalData.global_bac_audio_manager.bookid,
            booktype: app.globalData.global_bac_audio_manager.booktype,
            index: booklist[i + 1].epis,
            bookPhoto: app.globalData.global_bac_audio_manager.bookPhoto,
            hostName: app.globalData.global_bac_audio_manager.hostName,
            bookName: app.globalData.global_bac_audio_manager.bookname,
            audioname: booklist[i + 1].zname,
            audiotime: booklist[i + 1].timesize * 1,
          }
          this.playaudio(options)
          break; 
        }
      }
    }
  },

  /**
   * 列表切换集数
   */
  newchange:function(event) {
    
    this.setData({
      hideModal: true,
    })
    this.loading
    var options = {
      bookid: app.globalData.global_bac_audio_manager.bookid,
      booktype: app.globalData.global_bac_audio_manager.booktype,
      index: event.currentTarget.dataset.indexEpis,
      bookPhoto: app.globalData.global_bac_audio_manager.bookPhoto,
      hostName: app.globalData.global_bac_audio_manager.hostName,
      bookName: app.globalData.global_bac_audio_manager.bookname,
      audioname: event.currentTarget.dataset.indexName,
      audiotime: event.currentTarget.dataset.indexTime * 1,
    }
    this.playaudio(options)
  },

  /**
   * 监听播放暂停按钮
   */
  bindTapPlay: function () {
    // this.song()
    if (this.data.pauseStatus === true) {
      app.globalData.global_bac_audio_manager.playingStatus = true
      //如果背景音频为空时，请求播放下一集；非空时继续播放
      if (!(backgroundAudioManager.src === "")) {
        backgroundAudioManager.play();
      } else{
        this.bindTapNext()
      }
      this.setData({ pauseStatus: false });
    } else {
      app.globalData.global_bac_audio_manager.playingStatus = false
      backgroundAudioManager.pause();
      this.setData({ pauseStatus: true})
      // this.song()
    }
  },

  /**
   * 设置片头跳过时长
   */
  setskiptime: function () {
    this.setData({ hiddenmodalput: false })
  },
  cancelM: function () {
    this.setData({ hiddenmodalput: true })
  },
  confirmM: function () {
    this.setData({ hiddenmodalput: true })
    app.globalData.spiktime = this.data.spiktime
    wx.setStorage({
      key: "spikTime",
      data: this.data.spiktime*1
    })
  },
  spikTime: function (e) {
    this.setData({
      spiktime: e.detail.value * 1
    })
  },

  /**
   * 获取并记录书籍播放列表
   */
  getbookaudiolist(booktype, bookid) {
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
        console.log(res.data)
        app.globalData.playingbooklist = res.data.data
      }
    })
  },

  /**
   * 获取书籍信息
   */
  getaudiosrc(booktype, bookid, index, audioname, bookPhoto) {
    var t = this
    wx.request({
      url: 'https://www.soroke.cn/audio/playurl.do', // 仅为示例，并非真实的接口地址
      data: {
        booktype: booktype,
        bookid: bookid,
        index: index
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        t.setData({
          audiosrc: res.data.data.url,
          pauseStatus: false
        })
        backgroundAudioManager.title = audioname;
        backgroundAudioManager.coverImgUrl = encodeURI(bookPhoto);
        backgroundAudioManager.src = encodeURI(res.data.data.url);
        backgroundAudioManager.startTime = app.globalData.spiktime;
        app.globalData.global_bac_audio_manager.playingStatus = true

        if (app.globalData.global_bac_audio_manager.bookid != bookid) {
          t.getbookaudiolist(booktype, bookid);
        }
        t.stoploading()
      }
    })
  },
  
  /**
   * 设置新的播放列表
   */
  setaudiolist(index) {
    var t =this
    //清空列表
    t.setData({ audiolist: [] })
    var booklist = app.globalData.playingbooklist
    for (var i = 0; i < booklist.length; i++) {
      if (booklist[i].epis == index) {
        if(i<10) {
          for (var j = 0; j < 30; j++) {
            if (j === (booklist.length)) { break;}
            t.setData({ audiolist: t.data.audiolist.concat(booklist[j])})
          }
        } else {
          for (var j = i-10; j < i+21; j++) {
            if (j === (booklist.length)) { break; }
            t.setData({ audiolist: t.data.audiolist.concat(booklist[j])})
          }
        }
        break;
      }
    }
  },
  

  loading() {
    //加载中遮罩
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
  },

  stoploading() {
    //去除加载状态
    wx.hideLoading()
  },

  /**
   * 记录播放信息到缓存
   */
  huancun(booktype, bookid, index, bookname, bookPhoto, hostName,audioName,audiotime) {

    /**
     * 记录缓存
     */
    wx.setStorage({
      key: "booktype",
      data: booktype
    })
    wx.setStorage({
      key: "bookid",
      data: bookid
    })
    wx.setStorage({
      key: "bookname",
      data: bookname
    })
    wx.setStorage({
      key: "bookPhoto",
      data: bookPhoto
    })
    wx.setStorage({
      key: "hostName",
      data: hostName
    })
    wx.setStorage({
      key: "index",
      data: index
    })
    wx.setStorage({
      key: "playingaudioName",
      data: audioName
    })
    wx.setStorage({
      key: "playingaudioTime",
      data: audiotime
    })
    
  },

size(list) {
  var len=0
  for (var i = 0; i < list.length; i++) {
    len++;
  }
  return len
},
  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function () {
      that.fadeIn();//调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 720)//先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
})