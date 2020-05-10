const Product = require("../models/product");
const mongoose = require('mongoose');

exports.products_get_all = (req, res, next) => {
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
};

exports.products_create_product = (req, res, next) => {
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
};

exports.products_get_product = (req, res, next) => {
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

};

exports.products_update_product = (req, res, next) => {
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
};

exports.products_delete_product = (req, res, next) => {
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
};
