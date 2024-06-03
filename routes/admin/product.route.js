const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/product.controller")
const validate = require("../../validates/admin/productvalidate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItems);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);


router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);
router.get('/detail/:id', controller.detail);

module.exports = router;