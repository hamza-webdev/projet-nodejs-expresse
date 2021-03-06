const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const  Product = require ('../models/product');
const checkAuth = require('../middleware/check-auth');

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

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                //on peut use products: docs ou products: docs.map pour plus d info
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http:localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            console.log(response);
            if(docs.length > 0){
                res.status(200).json(response);
            }
            else {
                res.status(404).json({message: 'docs invalide ya pas des products en base de donnees'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
    ;
    // res.status(200).json({
    //     message: 'Handling GET requests to /products'
    // });
});

// check-auth on peut le mettre en 2 eme ou 3 eme position ca depond
// si on use req.body.toekn alors on met check-auth en 3 eme position
// si on utilise req.headers.authorization (token).. alors on met check-auth au 2 eme pos
router.post('/', checkAuth, upload.single('productImage'),  (req, res, next) => {
    // const file = req.file;
    // if (!file) {
    //     const error = new Error('Please upload a file');
    //     error.httpStatusCode = 400
    //     return next(error);
    // }
    const image = req.file;
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.filename
    });

    // enregistrer le produit creer avec function save et recoit un resultat postif d'enregistrement
    // sinon catch une error
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Add new product successful',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    // productImage: result.file.path,
                    _id: result._id,
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result._id
                },
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: " Product request invalide",
                error: err,
                createdProduct: product,
                infoFile: image
            })
        })
        })
    ;

router.get('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(" from database: ", doc);
            if(doc){
                res.status(200).json({
                   product : doc,
                   request: {
                       type: 'GET',
                       description: 'Get all products',
                       url: 'http://localhost:3000/products/' + doc._id
                   }
               })
            } else {
                res.status(404).json({message: 'doc invalide id invalid'})
            }
        })
        .catch(err => {
            Console.log(err);
            res.status(500).json({
                message: 'erreur d enregistrement',
                error: err
            });
        })
    ;

});

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Success updated product!'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'erreur de modification de produit',
                error: err
            });
        });
});

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Votre Produit a été supprime'
            });
        })
        .catch(err => console.log(err))
    ;
    // res.status(200).json({
    //     message: 'Deleted product!'
    // });
});

module.exports = router;