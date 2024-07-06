const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products")
//[GET] /
module.exports.index = async (req, res) => {
    //Lấy ra sản phẩm nổi bật
    const find = {
        featured: "1",
        deleted: false,
        status: "active"
    }
    const producsFeatured = await Product.find(find).limit(6)

    const newProductsFeatured = productsHelper.newPrice(producsFeatured)
    //end lấy ra sản phẩm nổi bật

    //Hiển thị danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6)

    const newProductsNew = productsHelper.newPrice(productsNew)
    //end Hiển thị danh sách sản phẩm mới nhất
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        producsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}