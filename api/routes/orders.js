const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select("product quantity _id")
        .populate('product')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                //on peut use products: docs ou products: docs.map pour plus d info
                orders: docs.map(doc => {
                    return {
                        quantity: doc.quantity,
                        product: doc.product,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http:localhost:3000/orders/' + doc._id
                        }
                    }
                })
            };
            console.log(response);
            if(docs.length > 0){
                res.status(200).json(response);
            }
            else {
                res.status(404).json({message: 'docs invalide ya pas orders en base de donnees'})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        })
    ;
    // res.status(200).json({
    //     message: 'Orders were fetched'
    // });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.product,
    });
    order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(505).json(err);
        })
    ;
    // const order = {
    //     productId: req.body.productId,
    //     quantity: req.body.quantity
    // }
    // res.status(201).json({
    //     message: 'Order was created',
    //     order: order
    // });
});

router.get('/:orderId', (req, res, next) => {

    const id = req.params.orderId;
    Order.findById(id)
        .select('product quantity')
        .populate('product')
        .exec()
        .then(doc => {
            console.log(" from database: ", doc);
            if(doc){
                res.status(200).json({
                    order : doc,
                    request: {
                        type: 'GET',
                        description: 'Get all Orders',
                        url: 'http://localhost:3000/orders/' + doc._id
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

    // res.status(200).json({
    //     message: 'Order details',
    //     orderId: req.params.orderId
    // });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Cette Order a été supprime'
            });
        })
        .catch(err => console.log(err))
    ;
    // res.status(200).json({
    //     message: 'Order deleted',
    //     orderId: req.params.orderId
    // });
});

module.exports = router;