const User = require("../../models/user.model")
module.exports = (res) => {
    _io.once('connection', (socket) => {
        //chức năng gửi yên cầu
        socket.on("CLIENT_ADD_FRIEND",async (userId)=>{
            const myUserId = res.locals.user.id

            // console.log(myUserId) // A
            // console.log(userId) // B

            //Thêm id của A vào acceptFriends của B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if(!existIdAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptFriends: myUserId }
                })
            }
            //Thêm id của B vào requestFriends của A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if(!existIdBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: { requestFriends: userId }
                })
            }
            // Lấy ra độ dài của acceptFriends của B và trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            //Lấy info của A trả về cho B
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName")

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            })
        })

        //chức năng hủy yên cầu
       socket.on("CLIENT_CANCEL_FRIEND",async (userId)=>{
            const myUserId = res.locals.user.id

            // console.log(myUserId) // A
            // console.log(userId) // B

            //Xóa id của A vào acceptFriends của B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if(existIdAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptFriends: myUserId }
                })
            }
            //Xóa id của B vào requestFriends của A
            const existIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if(existIdBinA) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { requestFriends: userId }
                })
            }
            // Lấy ra độ dài của acceptFriends của B và trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })
        }) 
        

        //chức năng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND",async (userId)=>{
            const myUserId = res.locals.user.id

            // console.log(myUserId) // B
            // console.log(userId) // A

            //Xóa id của A vào acceptFriends của B
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if(existIdAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { acceptFriends: userId }
                })
            }
            //Xóa id của B vào requestFriends của A
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if(existIdBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { requestFriends: myUserId }
                })
            }
        }) 

        
        //chức năng Chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND",async (userId)=>{
            const myUserId = res.locals.user.id

            // console.log(myUserId) // B
            // console.log(userId) // A


            //Thêm {user_id, room_chat_id} của A vào friendsList của B
            //Xóa id của A vào acceptFriends của B
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if(existIdAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: ""
                        }
                    } ,
                    $pull: { acceptFriends: userId }
                })
            }
            //Thêm {user_id, room_chat_id} của B vào friendsList của A
            //Xóa id của B vào requestFriends của A
            const existIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if(existIdBinA) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    } ,
                    $pull: { requestFriends: myUserId }
                })
            }
        }) 
    }); 
}