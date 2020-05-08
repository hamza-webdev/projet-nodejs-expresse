const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//mongodb+srv://hamza:<password>@db-mongo-bh-tiyts.mongodb.net/test?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://test:'+ process.env.MONGO_ATLAS_PW +'@db-mongo-bh-tiyts.mongodb.net/db_test',
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log( 'Database Connected' ))
    .catch(err => console.log( err )
    );

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({}));


// code concernant les erreur apparus soit sur le serveur ou client
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'PUT, POST, GET, PATCH');
        return res.status(200).json({
            message: 'message d erreur ici plus tard '
        });
    }
    next();
});

// recuperer les route de product and order
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
// si ya pas de route route not found
app.use((req, res, next) => {
    const error = new Error('Chemin introuvable !!');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;