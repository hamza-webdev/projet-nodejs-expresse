const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const  User = require ('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then( user => {
            if(user.length > 0){
                return res.status(409).json({
                    message: 'Désole cet email existe deja dans la base de donnees'
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        });
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    mesaage: 'User created',
                                    _id: result._id,
                                    email: result.email,
                                    password: result.password
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: err
                                })
                            })
                        ;
                    }
                });
            }
        })
        .catch();

} );

router.delete('/:userId', (req, res, next) => {
    User.deleteOne({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User supprimer avec success",
                info: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'erreur de supprussion d user' + err
            });
        })
    ;
});



module.exports = router;