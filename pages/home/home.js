// pages/home/home.js
const app = getApp();

Component({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        addNum: 0,
        lostNum: 0
    },

    pageLifetimes: {
        show() {
            if (app.globalData.userInfo) {
                this.setData({
                    userInfo: app.globalData.userInfo,
                    hasUserInfo: true
                })
            } else if (this.data.canIUse) {
                app.userInfoReadyCallback = res => {
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            } else {
                wx.getUserInfo({
                    success: res => {
                        app.globalData.userInfo = res.userInfo
                        this.setData({
                            userInfo: res.userInfo,
                            hasUserInfo: true
                        })
                    }
                })
            }
            var that = this
            wx.request({
                url: app.globalData.url + '/account/mine',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: { userId: app.globalData.userId }, // 'abcde'
                success(res) {
                    if (res.data.message == 'SUCCESS') {
                        that.setData({
                            addNum: res.data.find_num,
                            lostNum: res.data.lost_num
                        })
                    }
                }
            })
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                this.getTabBar().setData({ selected: 2 })
            }
        }
    },

    methods: {
        tapAddNum: function () {
            wx.navigateTo({ url: '/pages/myAdd/myAdd' })
        },

        tapLostNum: function () {
            wx.navigateTo({ url: '/pages/myLost/myLost' })
        },

        tapInfo: function() {
            wx.navigateTo({ url: '/pages/info/info' })
        },

        tapFeedback: function() {
            wx.navigateTo({ url: '/pages/feedback/feedback' })
        },

        tapService: function() {
            wx.showActionSheet({
                itemList: ['QQ客服：2743263948', 'QQ交流群：758488033'],
                success(res) {
                    if(res.tapIndex == 0){
                        wx.setClipboardData({ data: '2743263948' })
                    }else{
                        wx.setClipboardData({ data: '758488033' })
                    }
                }
            })
        },

        getUserInfo: function (e) {
            if (e.detail.userInfo === undefined) {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none'
                })
            } else {
                app.globalData.userInfo = e.detail.userInfo
                this.setData({
                    userInfo: e.detail.userInfo,
                    hasUserInfo: true
                })
            }
        }
    }
})