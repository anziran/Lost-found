// pages/feedback/feedback.js
const app = getApp();

Component({
    data: {
        adviceInput: '请输入遇到的问题或建议...',
        phoneInput: '选填，便于我们联系你',
        text: '',
        num: '',
        count: 0,
        loading: false
    },

    methods: {
        connectFail: function () {
            wx.showToast({
                title: '好像出了点问题...',
                icon: 'none'
            })
            this.setData({ loading: false })
        },

        textInput: function (e) {
            this.data.text = e.detail.value
            this.setData({ count: e.detail.value.length })
        },

        numInput: function (e) {
            this.data.num = e.detail.value
        },

        submit: function() {
            if (this.data.text == ''){
                wx.showToast({
                    title: '反馈或建议不能为空',
                    icon: 'none'
                })
            }else{
                this.setData({ loading: true })
                var that = this
                wx.request({
                    url: app.globalData.url + '/cst/comment',
                    method: 'POST',
                    header: { "Content-Type": "application/x-www-form-urlencoded" },
                    data: {
                        desc: that.data.text,
                        phone: that.data.num
                    },
                    success(res){
                        if (res.data.message == 'SUCCESS'){
                            wx.navigateBack()
                            wx.showToast({
                                title: '提交成功'
                            })
                        }else{
                            that.connectFail()
                        }
                    },
                    fail(res){
                        that.connectFail()
                    }
                })
            }
        }
    }
})