const Chat = require("../../models/chat.model")
const User = require("../../models/user.model")
//[GET] /chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const fullName = res.locals.user.fullName
    //SocketIo
    //khi dùng _io.on thì lúc load lại trang nó luôn tạo ra bản ghi mới nên thay thế bằng _io.on
    _io.once('connection', (socket) => {
       socket.on("CLIENT_SEND_MESSAGE",async (content)=>{
        //Lưu vào database
        const chat = new Chat({
            user_id: userId,
            content: content
        })
        await chat.save()
        //Trả data về client
        _io.emit("SERVER_RETURN_MESSAGE", {
            userId: userId,
            fullName: fullName,
            content: content
        })
       })
       // Typing
       socket.on("CLIENT_SEND_TYPING",async (type)=>{
          socket.broadcast.emit("CLIENT_SEND_TYPING", {
            userId: userId,
            fullName: fullName,
            type: type
          })
       })   
       // End Typing
      });
    //End SocketIo
    //Lấy data từ database
      const chats = await Chat.find({
        deleted: false
      })
      for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id
        }).select("fullName")
        chat.infoUser = infoUser
      }
    //End Lấy data từ database
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    })
}