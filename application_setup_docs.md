# Application Setup Documentation

This document details the setup and configuration of the Express application, including middleware, database connection, server initialization, error handling, and routing.

## 1. Express Application Initialization

The Express application is initialized in `app.js`.
First, the `express` module is imported, and then an instance of the Express application is created:

```javascript
const express = require('express');
const app = express();
```

## 2. Middleware Configuration

Several middleware functions are configured in `app.js` to add various functionalities to the application.

### Morgan (HTTP Request Logger)
Morgan is used for logging HTTP requests to the console in 'dev' format, which provides concise, color-coded output for development.

```javascript
const morgan = require('morgan');
app.use(morgan('dev'));
```

### Body-Parser (Request Body Parsing)
Body-parser is used to parse incoming request bodies. It handles URL-encoded data and JSON data.
- `bodyParser.urlencoded({extended: false})`: Parses URL-encoded data with the querystring library (when `extended` is `false`).
- `bodyParser.json()`: Parses JSON request bodies.

```javascript
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
```

### CORS (Cross-Origin Resource Sharing) Handling
The application includes custom middleware to handle CORS. This allows requests from different origins (domains) to access the application's resources.
- It sets `Access-Control-Allow-Origin` to `*` to allow requests from any origin.
- It defines allowed headers (`Origin, X-Requested-With, Content-Type, Accept, Authorization`).
- For `OPTIONS` requests (pre-flight requests), it sets allowed methods (`PUT, POST, GET, PATCH`) and returns a 200 status.

```javascript
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'PUT, POST, GET, PATCH');
        return res.status(200).json({
            message: 'message d erreur ici plus tard ' // Note: Placeholder error message
        });
    }
    next();
});
```

### Static File Serving
The application serves static files (e.g., images, documents) from the `uploads` directory. Any request to `/uploads/*` will serve the corresponding file from the local `uploads` folder.

```javascript
app.use('/uploads', express.static('uploads'));
```

## 3. Server Initialization (`server.js`)

The HTTP server is created and started in `server.js`.
- It imports the Node.js built-in `http` module and the Express `app` from `app.js`.
- It defines the port for the server to listen on, using the environment variable `process.env.PORT` if set, or defaulting to `3000`.
- An HTTP server is created using `http.createServer(app)`, passing the Express application to handle requests.
- The server starts listening on the configured port using `server.listen(port)`.

```javascript
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
```

## 4. Database Connection (Mongoose in `app.js`)

The application connects to a MongoDB database using Mongoose, an ODM (Object Data Modeling) library for MongoDB and Node.js.
- Mongoose is imported.
- The `mongoose.connect()` method is used to establish a connection to a MongoDB Atlas database. The connection string includes a placeholder for the password, which is fetched from the environment variable `process.env.MONGO_ATLAS_PW`.
- Connection options `useNewUrlParser`, `useCreateIndex`, and `useUnifiedTopology` are set for compatibility with the MongoDB driver.
- Callbacks are provided to log a success message upon connection or an error if the connection fails.
- `mongoose.Promise` is set to `global.Promise`, which means Mongoose will use the native JavaScript Promise implementation.

```javascript
const mongoose = require('mongoose');

// Example connection string structure: mongodb+srv://user:<password>@cluster-url/database_name
mongoose.connect('mongodb+srv://test:'+ process.env.MONGO_ATLAS_PW +'@db-mongo-bh-tiyts.mongodb.net/db_test',
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log( 'Database Connected' ))
    .catch(err => console.log( err )
    );

mongoose.Promise = global.Promise;
```

## 5. Error Handling Mechanisms (`app.js`)

The application implements two main error handling middlewares:

### 404 Not Found Handler
If a request does not match any of the defined routes, this middleware is triggered.
- It creates a new `Error` object with the message "Chemin introuvable !!".
- It sets the error status to `404`.
- It passes the error to the next error handling middleware using `next(error)`.

```javascript
app.use((req, res, next) => {
    const error = new Error('Chemin introuvable !!');
    error.status = 404;
    next(error);
});
```

### Generic Error Handler
This middleware catches errors passed by `next(error)` from other parts of the application (including the 404 handler or errors thrown in route handlers).
- It sets the HTTP response status to the error's status (if defined) or defaults to `500` (Internal Server Error).
- It sends a JSON response containing the error message.

```javascript
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
```

## 6. Route Handling

Routes for different parts of the application (products, orders, users) are defined in separate files and imported into `app.js`.
- Route modules are imported using `require()`.
- The `app.use()` method is used to mount these imported route handlers to specific base paths (e.g., `/products`, `/orders`, `/user`).

```javascript
// recuperer les route de product and order
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
```

Finally, the configured `app` object is exported from `app.js` to be used by `server.js`.

```javascript
module.exports = app;
```
