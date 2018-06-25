const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    dishId: mongoose.Schema.ObjectId,
    status: String
});

module.exports = mongoose.model('Order', orderSchema, 'orders');
  
  