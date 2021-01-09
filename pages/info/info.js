// pages/info/info.js
const app = getApp();

Component({
    data: {
        index: 0,
        schools: [],
        school: '',
        college: '',
        name: '',
        stuId: ''
    },

    lifetimes: {
        attached() {
            var that = this
            wx.request({
                url: app.globalData.url + '/account/privateInfo',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: { userId: app.globalData.userId },
                success(res) {
                    if (res.data.message == 'SUCCESS') {
                        // console.log(res.data)
                        that.setData({
                            school: res.data.university,
                            college: res.data.college,
                            name: res.data.name,
                            stuId: res.data.stuId,
                            schools: app.globalData.schools
                        })
                    }else{
                        that.connectFail()
                    }
                },
                fail(res) {
                    that.connectFail()
                }
            })
        }
    },

    methods: {
        connectFail: function () {
            wx.showToast({
                title: '好像出了点问题...',
                icon: 'none'
            })
        },

        tapSchool: function (e) {
            var that = this
            this.setData({
                index: e.detail.value,
                school: this.data.schools[e.detail.value]
            })
            wx.request({
                url: app.globalData.url + '/account/bindUniv',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: {
                    userId: app.globalData.userId,
                    university: this.data.school
                }
            })
        },

        editCollege: function (e) {
            var that = this
            this.setData({ college: e.detail.value })
            wx.request({
                url: app.globalData.url + '/account/bindCollege',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: {
                    userId: app.globalData.userId,
                    college: this.data.college
                }
            })
        },
        
        editName: function(e) {
            var that = this
            this.setData({ name: e.detail.value })
            wx.request({
                url: app.globalData.url + '/account/bindName',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: {
                    userId: app.globalData.userId,
                    name: this.data.name
                }
            })
        },

        editStudentId: function(e) {
            var that = this
            this.setData({ stuId: e.detail.value })
            wx.request({
                url: app.globalData.url + '/account/bindStuId',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: {
                    userId: app.globalData.userId,
                    stuId: this.data.stuId
                }
            })
        }
    }
})