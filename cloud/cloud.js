function requireStatistics() {
    const db = wx.cloud.database()
    return new Promise(function (resolve, reject) {
        // db.collection("statistics").doc("statistics").get().then(function(res){
        //     resolve(res.data)
        // })
        db.collection("statistics").doc("statistics").get({
            success: function(res) {
                resolve(res.data)
            }
        })
    })
}

function submit() {
    return new Promise(function (resolve, reject) {
        wx.cloud.callFunction({
            name: 'submit'
        }).then(function (res){
            resolve(res.result)
        })
    })   
}

function cancelSubmit() {
    return new Promise(function (resolve, reject) {
        wx.cloud.callFunction({
            name: 'cancelSubmit'
        }).then(function (res) {
            resolve(res.result)
        })
    })   
}

function claim() {
    return new Promise(function (resolve, reject) {
        wx.cloud.callFunction({
            name: 'claim'
        }).then(function (res) {
            resolve(res.result)
        })
    })   
}

function cancelClaim() {
    return new Promise(function (resolve, reject) {
        wx.cloud.callFunction({
            name: 'cancelClaim'
        }).then(function (res) {
            resolve(res.result)
        })
    })  
}

module.exports = {
    requireStatistics,
    submit,
    cancelSubmit,
    claim,
    cancelClaim
}