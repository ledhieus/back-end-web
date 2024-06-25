const md5 = require("md5")

const Account = require("../../models/account.model")

const Role = require("../../models/role.model")

const systemConfig = require("../../config/system")

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };
    const records = await Account.find(find).select("-password -token");
    //select để lấy ra những data cần lấy

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
}

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
}

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password);
    //md5 để mã hóa mật khẩu
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
        res.redirect("back")
    } else {
        const record = new Account(req.body);
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

//[GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    }

    try {
        const data = await Account.findOne(find)

        const roles = await Role.find({
            deleted: false
        })
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }

}

//[PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    })
    // $ne(not equal) để tìm các giá trị không phải giá trị id
    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password)
        }
        else {
            delete req.body.password
            //xóa đi phàn tử password trong obj
        }

        await Account.updateOne({ _id: id }, req.body)
        req.flash("success", "Chỉnh sửa thành công")
        
    }

    res.redirect("back")

}
