const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model")
const Account = require("../../models/account.model")


const systemConfig = require("../../config/system")

const filterStatusHelpers = require("../../helpers/filterStatus")
const searchHelpers = require("../../helpers/search")
const paginationHelpers = require("../../helpers/pagination")

const createTreeHelper = require("../../helpers/createTree")

//[GET] /admin/products
module.exports.index = async (req, res) => {
    // console.log(req.query.status);
    const filterStatus = filterStatusHelpers(req.query);

    let find = {
        deleted: false
    };
    //Status
    if (req.query.status) {
        find.status = req.query.status
    }

    //Search
    const objectSearch = searchHelpers(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelpers(
        {
            currentPage: 1,
            limitIteam: 4
        },
        req.query,
        countProducts
    )


    // End Pagination
    
    // Sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }else{
        sort.position = "desc";
    }

    // End Sort
    const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitIteam)
    .skip(objectPagination.skip);
    // console.log(products)

    for (const product of products){
        //Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if(user){
            product.accountFullName = user.fullName
        }

        //Lấy ra thông tin người cập nhật gần nhất
       
        const updatedBy = product.updatedBy[product.updatedBy.length - 1]
        if(updatedBy) {
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            })

            updatedBy.accountFullName = userUpdated.fullName
        }

    }

    res.render("admin/pages/products/index", {
        pageTitle: "Trang sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    //req.params lấy ra giá trị route động
    await Product.updateOne({ _id: id }, { 
        status: status,
        $push: { updatedBy: updatedBy }
    });
    //updateOne là hàm của mongoos để update 1 sản phẩm

    req.flash("success", "Cập nhật trạng thái thành công!")

    res.redirect("back");
}

//[PATCH] /admin/products/change-/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "active",
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`)
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, {
                status: "inactive",
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`)
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                {
                    deleted: true,
                    deletedBy:{
                        account_id: res.locals.user.id,
                        deletedAt: new Date()
                    }
                }
            );
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`)
            break;
        case "change-position":
            for (const item of ids) {
                
                let [id, position] = item.split("-")
                position = parseInt(position)

                await Product.updateOne({ _id: id }, {
                    position: position,
                    $push: { updatedBy: updatedBy }
                });

                req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm!`)
            }
            break;
        default:
            break;
    }
    res.redirect("back");
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteItems = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedBy:{
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    });
    req.flash("success", `Đã xóa thành công!`)

    res.redirect("back");
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    const category = await ProductCategory.find(find)

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Tạo mới sản phẩm",
        category: newCategory
    });
}

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    //test
    // if(!req.body.title.length < 8){
    //     req.flash("error", `Vui lòng nhập đủ 8 ký tự`);
    //     res.redirect("back");
    //     return;
    // }
    //end test
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1; 
    }else{
        req.body.position = parseInt(req.body.position);
    }
    
    req.body.createdBy = {
        account_id: res.locals.user.id
    }

   
    //req.body: lấy ra data

    const product = new Product(req.body);//tạo mới 1 sản phẩm
    await product.save();//Lưu sản phẩm vào database

    res.redirect(`${systemConfig.prefixAdmin}/products`)//trả về trang tạo mới sản phẩm
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);
     
        const category = await ProductCategory.find({
            deleted: false
        })
    
        const newCategory = createTreeHelper.tree(category);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        });
    } catch (error) {      
        req.flash("error", `Sản phẩm không tồn tại`); 
        res.redirect(`${systemConfig.prefixAdmin}/products`)
        
    }
    
}


//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.position = parseInt(req.body.position);

    
    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }
        await Product.updateOne({ _id: id }, {
            ...req.body,
            $push: { updatedBy: updatedBy }
        })
        req.flash("success", `Cập nhật thành công`);
    } catch (error) {
        req.flash("error", `Cập nhật thất bại`);
    }
    res.redirect(`back`)
}

//[GET] /admin/products/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
    
        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {      
        res.redirect(`${systemConfig.prefixAdmin}/products`)
        
    }
    
}