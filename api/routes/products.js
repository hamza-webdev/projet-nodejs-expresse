const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const  Product = require ('../models/product');
// const  Order = require ('../models/order');

router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            if(docs.length > 0){
                res.status(200).json(docs);
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

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    // enregistrer le produit creer avec function save et recoit un resultat postif d'enregistrement
    // sinon catch une error
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Handling POST requests to /products',
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: " Post request invalide",
                error: err,
                createdProduct: product

            })
        })
        })
    ;

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(" from database: ", doc);
            if(doc){
                res.status(200).json(doc);
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

router.patch('/:productId', (req, res, next) => {
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

router.delete('/:productId', (req, res, next) => {
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