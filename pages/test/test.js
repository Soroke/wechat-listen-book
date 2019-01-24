// pages/test/test.js
var util = require('../../utils/util.js')
const backgroundAudioManager = wx.getBackgroundAudioManager()

Page({
  tab: function () {
    wx.navigateTo({
      url: '../playing/playing',
    })
  },

  /**
   * 监控进度条的拖动
   */
  seek: function (e) {
    clearInterval(this.updateInterval)
    var that = this
    wx.seekBackgroundAudio({
      position: e.detail.value,
      complete: function () {
        // 实际会延迟两秒左右才跳过去
        setTimeout(function () {
          that._enableInterval()
        }, 1000)
      }
    })
  },

  /**
   * 进度条和时间更新
   * 500毫秒一次
   */
  _enableInterval: function () {
    var that = this
    update()
    this.updateInterval = setInterval(update, 500)
    function update() {
      wx.getBackgroundAudioPlayerState({
        success: function (res) {
          that.setData({
            audioTime: res.currentPosition,
            formatedPlayTime: util.formatTime(res.currentPosition + 1)
          })
        }
      })
    }
  },


  /**
   * 页面的初始数据
   */
  data: {
    audioindex: 1,
    audiotitle: '修真界败类第',
    audiosrc: 'https://xzjbl-1251678911.cos.ap-beijing.myqcloud.com/',
    imgurl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1545198146897&di=05789f1ce3b247177233f8cd180a416b&imgtype=0&src=http%3A%2F%2Fwww.woaitingshu.com%2Fpic%2Fimages%2F2016-7%2F20167417362152645.jpg',
    pauseStatus: true,
    audioSeek: 0,
    audioDuration: 0,
    audioTime: 325,
    playTime: 0,
    times: '00:00',
    formatedPlayTime: '00:00:00',
    items: [
      { name: '1', value: '1集' },
      { name: '2', value: '2集' },
      { name: '3', value: '3集' },
      { name: '4', value: '4集' },
      { name: '5', value: '5集' },
      { name: '6', value: '6集' },
    ],
    array: ['一集后', '二集后', '三集后', '四集后', '五集后'],
    objectArray: [
      {
        id: 0,
        name: '一集后'
      },
      {
        id: 1,
        name: '二集后'
      },
      {
        id: 2,
        name: '三集后'
      },
      {
        id: 3,
        name: '四集后'
      },
      {
        id: 4,
        name: '五集后'
      }
    ],
    close: -1,
    inputValue: '',
    firstLoad:false
  },

  /**
   * 监听定时关闭设置
   */
  bindPickerChange: function (e) {
    console.log('选择定时关闭为：', parseInt(e.detail.value) + 1 , '集后')
    this.setData({
      index: e.detail.value,
      close: parseInt(e.detail.value)+1
    })
  },
  /**
   * 搜索跳转到指定的集数
   */
  search: function (e) {
    this.setData({
      audioindex: parseInt(e.detail.value),
      playTime: 25
    })
    console.log('跳转到第', e.detail.value ,"集")
    this.song()
  },

  /**
   * 播放
   */
  song() {
    var t=this;
    //存储当前播放的集数到缓存
    wx.setStorage({
      key: 'jishu',
      data: this.data.audioindex
    })
    /**
     * 获取当前播放集数
     */
    var jishu = ''
    if (this.data.audioindex < 10) {
      jishu = '00' + this.data.audioindex
    } else if (this.data.audioindex >= 10 && this.data.audioindex < 100) {
      jishu = '0' + this.data.audioindex
    } else {
      jishu = this.data.audioindex
    }
    /**
     * 设置播放音频的url和title
     */
    backgroundAudioManager.src = this.data.audiosrc + jishu + '.mp3';
    backgroundAudioManager.title = this.data.audiotitle + jishu + '章';
    backgroundAudioManager.coverImgUrl = this.data.imgurl;
    backgroundAudioManager.startTime = this.data.playTime;

    backgroundAudioManager.onCanplay(() => {
      
      // backgroundAudioManager.pause();
      //初始化duration
      backgroundAudioManager.duration
      setTimeout(function () {
        var duration = backgroundAudioManager.duration;
        var min = parseInt(duration / 60);
        var sec = parseInt(duration % 60);
        if (min.toString().length == 1) {
          min = '0' + min;
        }
        if (sec.toString().length == 1) {
          sec = '0' + sec;
        }
        console.log(`当前音频长度为`, backgroundAudioManager.duration);
        t.setData({ audioDuration: backgroundAudioManager.duration, times: min + ':' + sec})
        console.log(`当前音频长度为`, t.data.times);
      },1000)
    })
    //backgroundAudioManager.pause()
  },

  /**
   * 下一集
   */
  ren() {
    if (this.data.audioindex <= 1253) {
      this.setData({ audioindex: this.data.audioindex + 1 })
      this.song()
    }
    
  },

  /**
   * 上一集
   */
  kun() {
    if (this.data.audioindex > 1) {
      this.setData({ audioindex: this.data.audioindex - 1 })
      this.song()
    }
    
  },


  /**
   * 监听播放暂停按钮
   */
  bindTapPlay: function () {
    // this.song()
    if (this.data.pauseStatus === true) {
      // console.log(`当前播放时间：`, this.data.audioSeek)
      if (this.data.audioSeek === 0) {
        this.song();
      } else {
        backgroundAudioManager.play();
        // this.setUrl();
        // backgroundAudioManager.seek(this.data.audioSeek);
      }
      
      this.setData({ pauseStatus: false});
    } else {
      this.setData({ pauseStatus: true, audioSeek: backgroundAudioManager.currentTime })
      backgroundAudioManager.pause();
      // this.song()
    }
  },

  bindTapNext:function() {
    wx.setStorage({
      key: 'shijian',
      data: 25
    })
    this.setData({ playTime: 25, pauseStatus: false})
    this.ren()
  },

  bindTapPrev: function () {
    wx.setStorage({
      key: 'shijian',
      data: 25
    })
    this.setData({ playTime: 25, pauseStatus: false })
    this.kun()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      this.setData({ firstLoad: true })
    

    /**
     * 实时更新播放时间和
     */
    this._enableInterval()
    /**
     * 检查缓存中的数据是否为空不为空时跳转到记录的集数
     */
    var t=this
    wx.getStorage({
      key: 'jishu',
      success(res) {
        if (!res.data.isNaN) {
          t.setData({ audioindex: res.data })
        } else{
          console.log(`缓存中集数为空`)
        }
        console.log(`当前缓存中的集数`, res.data)
      }
    })
    /**
     * 设置播放时间
     */
    wx.getStorage({
      key: 'shijian',
      success(res) {
        if (!res.data.isNaN) {
          t.setData({ playTime: res.data})
        } else {
          console.log(`缓存中播放时间为空`)
        }
        console.log(`当前缓存中的时间`, res.data)
      }
    })


    /**
     * 用户点击暂停时记录播放到的时间到缓存
     */
    backgroundAudioManager.onPause(() => {
      wx.setStorage({
        key: 'shijian',
        data: backgroundAudioManager.currentTime
      })
    })
    

    /**
     * 自然播放结束后的处理
     */
    backgroundAudioManager.onEnded(() => {
      
      
      console.log('close',this.data.close)
      if(this.data.close === 0) {
        backgroundAudioManager.stop()
        /**
         * 记录播放到的时间
         */
        wx.setStorage({
          key: 'shijian',
          data: 25
        })
        //存储当前播放的集数到缓存
        wx.setStorage({
          key: 'jishu',
          data: this.data.audioindex + 1
        })
        /**
         * 重置停止播放选项
         */
        this.setData({ close: -1, index: '', pauseStatus: true})
      } else if (this.data.close !== -1) {
        this.setData({ close: this.data.close-1})
        wx.setStorage({
          key: 'shijian',
          data: 25
        })
        this.setData({ playTime: 25, pauseStatus: false})
        this.ren()
      } else{
        wx.setStorage({
          key: 'shijian',
          data: 25
        })
        this.setData({ playTime: 25, pauseStatus: false})
        this.ren()
      }
    })
    /**
     * 系统音乐播放面板点击下一曲事件
     */
    backgroundAudioManager.onNext(() => {
      wx.setStorage({
        key: 'shijian',
        data: 25
      })
      this.setData({ playTime: 25,pauseStatus: false })
      this.ren()
    })
    /**
     * 系统音乐播放面板点击上一曲事件
     */
    backgroundAudioManager.onPrev(() => {
      wx.setStorage({
        key: 'shijian',
        data: 25
      })
      this.setData({ playTime: 25, pauseStatus: false})
      this.kun()
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
    var t = this
    if (this.data.firstLoad) {
      /**
       * 获取当前播放集数
       */
      var jishu = ''
      if (this.data.audioindex < 10) {
        jishu = '00' + this.data.audioindex
      } else if (this.data.audioindex >= 10 && this.data.audioindex < 100) {
        jishu = '0' + this.data.audioindex
      } else {
        jishu = this.data.audioindex
      }
      /**
       * 设置播放音频的url和title
       */
      backgroundAudioManager.src = this.data.audiosrc + jishu + '.mp3';
      backgroundAudioManager.title = this.data.audiotitle + jishu + '章';
      backgroundAudioManager.coverImgUrl = this.data.imgurl;
      backgroundAudioManager.startTime = this.data.playTime;
      backgroundAudioManager.onCanplay(() => {
        backgroundAudioManager.pause()
        //初始化duration
        backgroundAudioManager.duration
        setTimeout(function () {
          var duration = backgroundAudioManager.duration;
          var min = parseInt(duration / 60);
          var sec = parseInt(duration % 60);
          if (min.toString().length == 1) {
            min = '0' + min;
          }
          if (sec.toString().length == 1) {
            sec = '0' + sec;
          }
          t.setData({ audioDuration: backgroundAudioManager.duration, times: min + ':' + sec })

        }, 500)
        
      })

      /**
       * 设置播放时间
       */
      wx.getStorage({
        key: 'shijian',
        success(res) {
          if (!res.data.isNaN) {
            t.setData({ formatedPlayTime: util.formatTime(res.data), audioTime: res.data })
          } else {
            t.setData({ formatedPlayTime: util.formatTime(backgroundAudioManager.currentTime), audioTime: backgroundAudioManager.currentTime })
          }
        }
      })
      t.setData({ firstLoad: false })
    } else {
      t.setData({ formatedPlayTime: util.formatTime(backgroundAudioManager.currentTime), audioTime: backgroundAudioManager.currentTime })
    }
    // , audioTime: res.data 
    
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