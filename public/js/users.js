// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", ()=> {
            // console.log(button.closest(".box-user"))
            button.closest(".box-user").classList.add("add")
            const userId = button.getAttribute("btn-add-friend")
            // console.log(userId)

            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}
// Hết Chức năng gửi yêu cầu

// Chức năng hủy yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", ()=> {
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("btn-cancel-friend")

            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}
// Hết Chức năng hủy yêu cầu

// Chức năng hủy Từ chối
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", ()=> {
            button.closest(".box-user").classList.add("refuse")
            const userId = button.getAttribute("btn-refuse-friend")

            socket.emit("CLIENT_REFUSE_FRIEND", userId)
        })
    })
}
// Hết Chức năng Từ chối

//chức năng Chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if(listBtnAcceptFriend.length > 0){
    listBtnAcceptFriend.forEach(button => {
        button.addEventListener("click", ()=> {
            button.closest(".box-user").classList.add("accepted")
            const userId = button.getAttribute("btn-accept-friend")

            socket.emit("CLIENT_ACCEPT_FRIEND", userId)
        })
    })
}
// Hết chức năng Chấp nhận kết bạn

//SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgUsersAccept = document.querySelector("[bage-users-accept]")
if(badgUsersAccept) {
    const userId = badgUsersAccept.getAttribute("bage-users-accept")
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if(userId === data.userId){
            badgUsersAccept.innerHTML = data.lengthAcceptFriends
        }
    })
}

//end SERVER_RETURN_LENGTH_ACCEPT_FRIEND