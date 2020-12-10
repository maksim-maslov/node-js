'use strict';

const Client = require('./models/client');
const Dish = require('./models/dish');
const Order = require('./models/order');
const dbConfig = require('./db');

const server = require('./server');

const drone = require('netology-fake-drone-api');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const model = {Client, Dish, Order};

const dbConnectionOptions = { keepAlive: true, socketTimeoutMS: 0 };

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, dbConnectionOptions, (err, database) => {

  if (err) {
    console.log('Unable to connect to MongoDB server. Error: ', error);
  } else {
    console.log('Connected to MongoDB server');
  }
  
});



// Отправляет код статуса 200
//
exports.openStartPage = function(req, res) {
  res.status(200);  
}




// Находит клиента по имени и email 
//

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


// Создает клиента
//

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


// Обновляет баланс клиента
//

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


// Получает список заказов
//

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


// Создает заказ
//

exports.createOrder = function(req, res) {

  const newOrder = new model.Order();
  
  newOrder.userId = mongoose.Types.ObjectId(req.body.userId);
  newOrder.dishId = mongoose.Types.ObjectId(req.body.dishId);
  newOrder.status = 'Ordered';
  
  newOrder.save(err => {

    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Order created' });

      server.socketIO.emit('createOrder');
    }

  });

}


// Обновляет статус заказа
//

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

          if (order.status == 'Ordered') {
            server.socketIO.emit('createOrder');
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
                    server.socketIO.emit('changeStatus', order);
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
                    server.socketIO.emit('changeStatus', order);
                  }
                });

              });

            res.json({ message: 'Order updated' });

          }
        }
      });
    }
  });
}


// Удаляет заказ
//

exports.deleteOrder = function(req, res) {

  model.Order.findByIdAndRemove(req.params.order_id, (err, order) => {

    if (err) {
      res.send(err);
    } else {
      console.log('Удалено');
      res.json({ message: 'Order deleted' }); 
      server.socketIO.emit('deleteOrder');
    }

  });

}


// Получает список блюд
//

exports.getDishes = function(req, res) {

  model.Dish.find((err, dishes) => {

    if (err) {
      res.send(err);
    } else {
      res.json(dishes);
    }

  });

}


