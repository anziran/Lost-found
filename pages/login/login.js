// pages/login/login.js
const app = getApp()
Page({
    data: {
        userId: '',
        index: 0,
        schools: [],
        school: '选择高校'
    },

    onLoad: function (options) {
        app.userIdReadyCallback = res => {
            this.setData({ userId: app.globalData.userId })
            if (!app.globalData.newUser)
                wx.switchTab({ url: '/pages/lost/lost' })
        }
        if (!app.globalData.newUser)
            wx.switchTab({ url: '/pages/lost/lost' })

        this.setData({
            schools: app.globalData.schools,
            userId: app.globalData.userId 
        })
    },
    
    bindPickerChange: function(e){
        this.setData({
            index: e.detail.value,
            school: this.data.schools[e.detail.value]
        })
    },

    getUserInfo: function (e) {
        if (e.detail.userInfo === undefined){
            wx.showToast({
                title: '绑定失败',
                icon: 'none'
            })
        } else {
            wx.request({
                url: app.globalData.url + '/account/firstEntrance',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: {
                    userId: this.data.userId,
                    university: this.data.school
                },
                success(res) {
                    if (res.data.message == 'SUCCESS') {
                        wx.switchTab({ url: '/pages/lost/lost' })
                        wx.showToast({ title: '绑定成功' })
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: '绑定失败'
                        })
                    }
                }
            })
            app.globalData.userInfo = e.detail.userInfo
        }
    }
})