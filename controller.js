'use strict';

const Client = require('./models/client');
const Dish = require('./models/dish');
const Order = require('./models/order');

// const express = require('express');
// const app = express();

// const http = require('http');
// const io = require('socket.io');
// const server = http.Server(app);
// const socketIO = io(server);


const drone = require('netology-fake-drone-api');

const mongoose = require('mongoose');

let env = process.env.ENV_NODE = process.env.ENV_NODE || 'development';

let url = null;
if (env === 'development') {
  url = 'mongodb://localhost:27017/Drone-Cafe';
} else {
  url = 'mongodb://dbtest:dbtest1@ds263670.mlab.com:63670/drone-cafe';
}

url = 'mongodb://dbtest:dbtest1@ds263670.mlab.com:63670/drone-cafe';

const Schema = mongoose.Schema;



const model = {Client, Dish, Order};

const dbConnectionOptions = { keepAlive: true, socketTimeoutMS: 0 };

mongoose.Promise = global.Promise;

mongoose.connect(url, dbConnectionOptions, (err, database) => {

  if (err) {
    console.log('Unable to connect to MongoDB server. Error: ', error);
  } else {
    console.log('Connected to MongoDB server');
  }
  
});


exports.getClient = function(req, res) {

  const searchQuery = {};

  if (req.query.name) {    
    searchQuery.name = req.query.name;
  };

  if (req.query.email) {    
    searchQuery.email = req.query.email;
  };

  model.Client.find(searchQuery, (err, clients) => {

    if (err) {
      res.send(err);
    } else {
      res.json(clients);
    }

  });

}


exports.createClient = function(req, res) {

  const newClient = new model.Client();
  newClient.name = req.body.name;
  newClient.email = req.body.email;
  newClient.balance = 100;

  newClient.save(err => {

    if (err) {
      res.send(err);
    } else {
      res.json(newClient);
    }

  });

}


exports.updateClient = function(req, res) {

  model.Client.findById(req.params.client_id, (err, client) => {

    if (err) {
      res.send(err);
    } else {

      client.balance = req.body.balance;

      client.save(err => {

        if (err) {
          res.send(err);
        } else {
          res.json({ message: 'Client updated' });
        }

      });

    }

  });

}


exports.getOrders = function(req, res) {

  const matchQuery = {
    $match: {}
  };

  if (req.query.userId) {
    matchQuery.$match['userId'] = mongoose.Types.ObjectId(req.query.userId);
  }

  if (req.query.status) {    
    matchQuery.$match['status'] = req.query.status;
  }

  model.Order.aggregate({

    $lookup: {
      'from': 'dishes',
      'localField': 'dishId',
      'foreignField': '_id',
      'as': 'dish'
    }

  },

  {
    $unwind: '$dish'
  },

  {
    $project: {
      '_id': 1,
      'userId': 1,
      'dishId': 1,
      'status': 1,
      'dishName': '$dish.title'
    }
  },

  matchQuery)
  .exec((err, orders) => {

    if (err){
      res.send(err);
    } else {
      res.json(orders);
    }

  });

}


exports.createOrder = function(req, res, next, socketIO) {

  console.log(socketIO);

  const newOrder = new model.Order();
  
  newOrder.userId = mongoose.Types.ObjectId(req.body.userId);
  newOrder.dishId = mongoose.Types.ObjectId(req.body.dishId);
  newOrder.status = 'Ordered';
  
  newOrder.save(err => {

    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Order created!' });

      socketIO.emit('createOrder');
    }

  });

}


exports.updateOrder = function(req, res) {
    
  model.Order.findById(req.params.order_id, (err, order) => {

    if (err) {
      res.send(err);
    } else {

      order.status = req.body.status;
      
      order.save(err => {

        if (err) {
          res.send(err);
        } else {

          res.json({ message: 'Order updated!' });

          if (order.status == 'Ordered') {
            socketIO.emit('createOrder');
          };

          if (order.status == 'Delivery') {

            drone
              .deliver()
              .then(() => {
                
                console.log('Доставлено');                
                order.status = 'Served';
                
                order.save(err => {
                  if (err) {
                    console.log(err);
                  } else {
                    socketIO.emit('changeStatus', order);
                  }
                });

              })
              .catch(() => {

                console.log('Возникли сложности');
                order.status = 'Trouble';

                order.save(err => {
                  if (err) {
                    console.log(err);
                  } else {
                    socketIO.emit('changeStatus', order);
                  }
                });

              });
          }
        }
      });
    }
  });
}


exports.deleteOrder = function(req, res) {

  model.Order.remove({_id: req.params.orderId}, (err, order) => {

    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Order deleted' });
    }

  });
}


exports.getDishes = function(req, res) {

  model.Dish.find((err, dishes) => {

    if (err) {
      res.send(err);
    } else {
      res.json(dishes);
    }

  });

}


