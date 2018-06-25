const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    name: String,
    email: String,
    balance: Number
});

module.exports = mongoose.model('Client', clientSchema, 'clients');
