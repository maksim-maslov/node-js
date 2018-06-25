const mongoose = require('mongoose');

const dishSchema = mongoose.Schema({
    title: String,
    image: String,
    rating: Number,
    ingredients: [String],
    price: Number
});

module.exports =  mongoose.model('Dish', dishSchema, 'dishes');
  
  