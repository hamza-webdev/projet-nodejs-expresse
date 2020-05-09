const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const  User = require ('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// router for login login
router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth failed: Vous n\ête pas enregistrer, creer votre compte lien',
                    lien: 'http://localhost:3000/signup'
                })
            }

            bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: '2 - Auth failed: Votre login ou mot de passe inciorrecte! '
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email:user[0].email,
                            userId: user[0]._id
                            },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Connexion reussit! vous ete connecté !',
                        token: token,
                        info: user
                    });
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'erreur de supprussion d user' + err
            })
        })
    ;
});


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