const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    productId: String,
    quantity: Number
});

module.exports = mongoose.model('Order', orderSchema);