// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        return await db.collection('statistics').update({
            data: {
                lost_num: db.command.inc(1)
            },
        })
    } catch (e) {
        console.error(e)
    }   
}