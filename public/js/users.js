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
const refuseFriend = (button) => {
    button.addEventListener("click", ()=> {
        button.closest(".box-user").classList.add("refuse")
        const userId = button.getAttribute("btn-refuse-friend")

        socket.emit("CLIENT_REFUSE_FRIEND", userId)
    })
}
// Chức năng hủy Từ chối
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button)
    })
}
// Hết Chức năng Từ chối

//chức năng Chấp nhận kết bạn
const acceptFriend = (button) => {
    button.addEventListener("click", ()=> {
        button.closest(".box-user").classList.add("accepted")
        const userId = button.getAttribute("btn-accept-friend")

        socket.emit("CLIENT_ACCEPT_FRIEND", userId)
    })
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if(listBtnAcceptFriend.length > 0){
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button)
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

//SERVER_RETURN_INFO_ACCEPT_FRIEND
const dataUsersAccept = document.querySelector("[data-users-accept]")
if(dataUsersAccept){
    const userId = dataUsersAccept.getAttribute("data-users-accept")
    
    socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
        if(userId === data.userId){
            //Vẽ user ra giao diện
            console.log(data)
            const div = document.createElement("div")
            div.classList.add("col-6")

            div.innerHTML = `
            <div class="box-user">
                <div class="inner-avatar">
                    <img src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg" alt="${data.infoUserA.fullName}">
                </div>
                <div class="inner-info">
                    <div class="inner-name">
                        ${data.infoUserA.fullName}
                    </div>
                    <div class="inner-buttons">
                        <button 
                            class="btn btn-sm btn-primary mr-1"
                            btn-accept-friend="${data.infoUserA._id}"
                        >
                            Chấp nhận
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary mr-1"
                            btn-refuse-friend="${data.infoUserA._id}"
                            >
                            Xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-secondary mr-1"
                            btn-deleted-friend="" 
                            disabled="disabled"
                        >
                            Đã xóa
                        </button>
                        <button 
                            class="btn btn-sm btn-primary mr-1"
                            btn-accepted-friend="" 
                            disabled="disabled"
                        >
                            Đã chấp nhận
                        </button>
                    </div>
                </div>
            </div>
            `
            dataUsersAccept.appendChild(div)
            //hết vẽ user ra giao diện

            //Hủy lời mời kết bạn
            const buttonRefuse = div.querySelector("[btn-refuse-friend]")
            refuseFriend(buttonRefuse)
            //Hết hủy lời mời kết bạn

            //Chấp nhận lời mời kết bạn
            const buttonAccept = div.querySelector("[btn-accept-friend]")
            acceptFriend(buttonAccept)
            //End Chấp nhận lời mời kết bạn

        }
    })
}

//END SERVER_RETURN_INFO_ACCEPT_FRIEND