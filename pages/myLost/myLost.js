// pages/myLost/myLost.js
const app = getApp();
const cloud = require("../../cloud/cloud.js")

Component({
    data: {
        isLoading: false,
        pageNo: 0,
        pageSize: 15,
        dataArray: [],
        showBoard: false,
        boardText: ''
    },

    lifetimes: {
        attached() {
            this.requestData()
        }
    },

    methods: {
        requestData: function () {
            this.setData({ isLoading: true })
            let that = this
            wx.request({
                url: app.globalData.url + '/lost/myLost',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: { // 'abcde'
                    userId: app.globalData.userId,
                    pageNo: this.data.pageNo,
                    pageSize: this.data.pageSize
                },
                success(res) {
                    if (res.data.message == 'SUCCESS') {
                        let temp = that.data.dataArray.concat(res.data.lost_list)
                        that.setData({
                            dataArray: temp,
                            isLoading: false
                        })
                        that.data.pageNo++
                    }
                }
            })
        }, 
        
        refreshData: function (i) {
            let that = this
            wx.request({
                url: app.globalData.url + '/lost/cancelClm',
                method: 'POST',
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: {
                    id: this.data.dataArray[i].id,
                    category: this.data.dataArray[i].category
                },
                success(res) {
                    if (res.data.message == 'SUCCESS') {

                        cloud.cancelClaim()

                        that.data.dataArray.splice(i, 1);
                        let pn = that.data.dataArray.length / that.data.pageSize
                        pn = parseInt(pn)
                        wx.request({
                            url: app.globalData.url + '/lost/myLost',
                            method: 'POST',
                            header: { "Content-Type": "application/x-www-form-urlencoded" },
                            data: { // 'abcde'
                                userId: app.globalData.userId,
                                pageNo: pn,
                                pageSize: that.data.pageSize
                            },
                            success(res2) {
                                if (res2.data.message == 'SUCCESS') {
                                    var temp1 = that.data.dataArray[that.data.dataArray.length - 1]
                                    var temp2 = res2.data.lost_list[res2.data.lost_list.length - 1]
                                    if (!temp1 || temp1.id != temp2.id)
                                        that.data.dataArray.push(res2.data.lost_list[res2.data.lost_list.length - 1])
                                    if (that.data.dataArray[0] == undefined){
                                        that.setData({ dataArray: [] })
                                    }else{
                                        that.setData({ dataArray: that.data.dataArray })
                                    }
                                }
                            }
                        })
                    }
                }
            })
        },
        
        cancel: function (e) {
            let that = this
            wx.showModal({
                title: '提示',
                content: '确定要撤销吗？',
                success(res) {
                    if (res.confirm) {
                        let i = e.currentTarget.dataset.index
                        that.refreshData(i)
                    }
                }
            })
        },

        onReachBottom: function () {
            this.requestData()
        },

        showLocation: function (e) {
            let i = e.currentTarget.dataset.index
            this.setData({
                showBoard: true,
                boardText: this.data.dataArray[i].take_place
            })
        },

        showDescription: function (e) {
            let i = e.currentTarget.dataset.index
            this.setData({
                showBoard: true,
                boardText: this.data.dataArray[i].description
            })
        },

        closeBoard: function () {
            this.setData({ showBoard: false })
        }
    }
})