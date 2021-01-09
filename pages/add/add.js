const app = getApp();
const cloud = require("../../cloud/cloud.js")
Component({
    data: {
        addNum: 0,
        backNum: 0,
        card_name: '',
        card_college: '',
        card_stuId: '',
        card_location: '',
        other_image: '/images/upload.png',
        other_category: '',
        other_description: '',
        other_location: '',
        page: 0,
        hasImage: false,
        loading: false,
        index: 0,
        category: ['优盘', '雨伞', '钱包证件', '电子产品', '其他']
    },
    
    pageLifetimes: {
        show() {
            if (typeof this.getTabBar === 'function' && this.getTabBar()) {
                this.getTabBar().setData({ selected: 1 })
            }
            this.refreshStatistic();
        }
    },

    methods: {
        connectFail: function() {
            wx.showToast({
                title: '好像出了点问题...',
                icon: 'none'
            })
            this.setData({ loading: false })
        },

        refreshStatistic: function() {
            let that = this

            // wx.request({
            //     url: app.globalData.url+'/lost/statistics',
            //     method: 'POST',
            //     header: { "Content-Type": "application/x-www-form-urlencoded" },
            //     success(res) {
            //         if (res.data.message == 'SUCCESS') {
            //             // console.log(res.data)
            //             that.setData({
            //                 addNum: res.data.lost_num,
            //                 backNum: res.data.find_num
            //             })
            //         }
            //     }
            // })

            cloud.requireStatistics().then(function(res) {
                that.setData({
                    addNum: res.lost_num,
                    backNum: res.find_num
                })
            })
        },

        selectCard: function() {
            this.setData({ page: 0 })
        },

        selectOther: function () {
            this.setData({ page: 1 })
        },

        cEditName: function(e) {
            this.data.card_name = e.detail.value
        },

        cEditCollege: function(e) {
            this.data.card_college = e.detail.value
        },

        cEditStuId: function(e) {
            this.data.card_stuId = e.detail.value
        },

        cEditLocation: function(e) {
            this.data.card_location = e.detail.value
        },

        oEditDescription: function(e) {
            this.data.other_description = e.detail.value
        },

        oEditLocation: function(e) {
            this.data.other_location = e.detail.value
        },

        chooseImage: function() {
            let that = this
            wx.chooseImage({
                count: 1,
                sizeType: ['compressed'],
                success: function(res) {
                    that.setData({ 
                        other_image: res.tempFilePaths[0],
                        hasImage: true
                    })
                }
            })
        },

        tapCategory: function(e) {
            this.setData({ 
                index: e.detail.value,
                other_category: this.data.category[e.detail.value]
            })
        },

        isFinishFill: function() {
            if (this.data.page == 0) {
                return  this.data.card_name.length != 0 &&
                        this.data.card_college.length != 0 &&
                        this.data.card_stuId.length != 0 &&
                        this.data.card_location.length != 0
            } else {
                return  this.data.hasImage &&
                        this.data.other_category.length != 0 &&
                        this.data.other_description.length != 0 &&
                        this.data.other_location.length != 0
            }
        },

        submit: function() {
            let that = this
            if(!this.isFinishFill()){
                wx.showToast({
                    title: '请将信息填写完整',
                    icon: 'none'
                })
                return
            }
            this.setData({ loading: true })
            if(this.data.page == 0){
                wx.request({
                    url: app.globalData.url + '/lost/card',
                    method: 'POST',
                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                    data: { // 'abcde'
                        userId: app.globalData.userId,
                        name: this.data.card_name,
                        college: this.data.card_college,
                        stuId: this.data.card_stuId,
                        takePlace: this.data.card_location
                    },
                    success(res) {
                        if (res.data.message == 'SUCCESS') {
                            wx.showToast({ title: '发布成功' })

                            cloud.submit().then(function (res) {
                                that.refreshStatistic()
                                that.setData({
                                    card_name: '',
                                    card_college: '',
                                    card_stuId: '',
                                    card_location: '',
                                    loading: false
                                })
                            })

                            // that.refreshStatistic()
                            // that.setData({
                            //     card_name: '',
                            //     card_college: '',
                            //     card_stuId: '',
                            //     card_location: '',
                            //     loading: false
                            // })
                        } else {
                            that.connectFail()
                        }
                    },
                    fail(res) {
                        that.connectFail()
                    }
                })
            }else{
                wx.uploadFile({
                    url: app.globalData.url + '/lost/item',
                    filePath: this.data.other_image,
                    name: 'image',
                    formData: { // 'abcde'
                        userId: app.globalData.userId,
                        category: this.data.other_category,
                        desc: this.data.other_description,
                        claimMethod: this.data.other_location
                    },
                    success(res) {
                        var data = JSON.parse(res.data);
                        if (data.message == 'SUCCESS') {
                            wx.showToast({ title: '发布成功' })

                            cloud.submit().then(function (res) {
                                that.refreshStatistic()
                                that.setData({
                                    other_image: '/images/upload.png',
                                    other_category: '',
                                    other_description: '',
                                    other_location: '',
                                    hasImage: false,
                                    loading: false
                                })
                            })

                            // that.refreshStatistic()
                            // that.setData({
                            //     other_image: '/images/upload.png',
                            //     other_category: '',
                            //     other_description: '',
                            //     other_location: '',
                            //     hasImage: false,
                            //     loading: false
                            // })
                        } else {
                            that.connectFail()
                        }
                    },
                    fail(res) {
                        that.connectFail()
                    }
                })
            }
        }
    }
})
