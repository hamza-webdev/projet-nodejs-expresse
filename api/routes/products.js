const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const  Product = require ('../models/product');
const checkAuth = require('../middleware/check-auth');

//recuperer le controller
const ProductsController = require('../controllers/products');

const multer = require('multer');
const fs = require('fs-extra');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = './uploads';
        // fs.mkdirsSync(path);
        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, 'image_'+Date.now() +'_'+ file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
  // rejet file
  if (file.mimetype === 'image/jpeg' || 'image/png' || 'image/gif' || 'image/jpg'){
      cb(null, true);
  } else{
      cb(null, false);
  }
};
// const upload = multer({dest: 'uploads/'});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024* 1024 *5
        },
    // fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);

// check-auth on peut le mettre en 2 eme ou 3 eme position ca depond
// si on use req.body.toekn alors on met check-auth en 3 eme position
// si on utilise req.headers.authorization (token).. alors on met check-auth au 2 eme pos
router.post('/', checkAuth, upload.single('productImage'),  ProductsController.products_create_product);

router.get('/:productId', checkAuth, ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;