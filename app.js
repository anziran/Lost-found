//app.js
App({
    globalData: {
        userInfo: null,
        schools: ['四川大学'],
        userId: '',
        newUser: true,
        url: 'https://aneoncode.com'
    },
    
    onLaunch: function() {
        wx.cloud.init()

        var that = this
        wx.login({
            success(res) {
                if (res.code) {
                    wx.request({
                        url: that.globalData.url+'/account/login',
                        method: 'POST',
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        data: { jscode: res.code },
                        success(res2) {
                            if (res2.data.message == 'SUCCESS') {
                                console.log(res2.data)
                                that.globalData.userId = res2.data.userId
                                if (res2.data.code == 1) that.globalData.newUser = false
                                if (that.userIdReadyCallback) that.userIdReadyCallback(res2)
                            }
                        }
                    })
                }
            }
        })
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: res => {
                            this.globalData.userInfo = res.userInfo
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    }
})