'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const io = require('socket.io');

const mongoose = require('mongoose');
let env = process.env.ENV_NODE = process.env.ENV_NODE || 'development';
let url = null;
if (env === 'development') {
    url = 'mongodb://localhost:27017/Drone-Cafe';
} else {
    url = 'mongodb://dbtest:dbtest1@ds263670.mlab.com:63670/drone-cafe';
}

url = 'mongodb://dbtest:dbtest1@ds263670.mlab.com:63670/drone-cafe';

const drone = require('netology-fake-drone-api');

const app = express();
const server = http.createServer(app);
const socketIO = io(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/'));

const port = process.env.PORT || 3000;

const router = express.Router();

const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  name: String,
  email: String,
  balance: Number
});

const DishSchema = new Schema({
  title: String,
  image: String,
  rating: Number,
  ingredients: [String],
  price: Number
});

const OrderSchema = new Schema({
  userId: mongoose.Schema.ObjectId,
  dishId: mongoose.Schema.ObjectId,
  status: String
});

const model = {
  Client: mongoose.model('Client', ClientSchema, 'clients'),
  Dish: mongoose.model('Dish', DishSchema, 'dishes'),
  Order: mongoose.model('Order', OrderSchema, 'orders')
} 

const dbConnectionOptions = { keepAlive: true, socketTimeoutMS: 0 };

mongoose.Promise = global.Promise;

mongoose.connect(url, dbConnectionOptions, (error, database) => {
  if (error) {
  console.log('Unable to connect to MongoDB server. Error: ', error);
  } else {
  console.log('Connected to MongoDB server');
  }
});


router.route('/clients')
  .get((req, res) => {

  let searchQuery = {};

  if ((req.query.name !== null) && (req.query.name !== undefined)) {
    let name = req.query.name;
    searchQuery.name = name;
  };

  if ((req.query.email !== null) && (req.query.email !== undefined)) {
    let email = req.query.email;
    searchQuery.email = email;
  };

  model.Client.find(searchQuery, (err, clients) => {
    if (err) {
    res.send(err);
    } else {
    res.json(clients);
    };
  });
  })
  .post((req, res) => {
  const newClient = new model.Client();
  newClient.name = req.body.name;
  newClient.email = req.body.email;
  newClient.balance = 100;
  newClient.save((err) => {
    if (err) {
    res.send(err);
    } else {
    res.json(newClient);
    }
  });
  });

router.route('/clients/:client_id')
  .put((req, res) => {
  model.Client.findById(req.params.client_id, (err, client) => {
    if (err) {
    res.send(err);
    } else {
    client.balance = req.body.balance;
    client.save((err) => {
      if (err) {
      res.send(err);
      } else {
      res.json({ message: 'Client updated!' });
      };
    });
    };
  });
  });

router.route('/orders')
  .get((req, res) => {

  let matchQuery = {
    $match: {
    }
  };

  if ((req.query.userId !== null) && (req.query.userId !== undefined)) {
    let userId = req.query.userId;
    matchQuery.$match["userId"] = mongoose.Types.ObjectId(userId);
  };

  if ((req.query.status !== null) && (req.query.status !== undefined)) {
    let status = req.query.status;
    matchQuery.$match["status"] = status;
  };

  model.Order.aggregate({
    $lookup: {
    "from" : "dishes",
    "localField" : "dishId",
    "foreignField" : "_id",
    "as" : "dish"
    }
  },
  {
    $unwind: "$dish"
  },
  {
    $project: {
    "_id": 1,
    "userId": 1,
    "dishId": 1,
    "status": 1,
    "dishName": "$dish.title"
    }
  },
  matchQuery)
  .exec((err, orders) => {
    if (err){
    res.send(err);
    } else {
    res.json(orders);
    };
  });
  })
  .post((req, res) => {
  const newOrder = new model.Order();
  newOrder.userId = mongoose.Types.ObjectId(req.body.userId);
  newOrder.dishId = mongoose.Types.ObjectId(req.body.dishId);
  newOrder.status = 'Ordered';
  newOrder.save((err) => {
    if (err) {
    res.send(err);
    } else {
    res.json({ message: 'Order created!' });

    socketIO.emit('createOrder');
    }
  });
  });

router.route('/orders/:order_id')
  .put((req, res) => {
  model.Order.findById(req.params.order_id, (err, order) => {
    if (err) {
    res.send(err);
    } else {
    order.status = req.body.status;
    order.save((err) => {
      if (err) {
      res.send(err);
      } else {
      res.json({ message: 'Order updated!' });

      if (order.status == 'Ordered') {
        socketIO.emit('createOrder');
      };

      };
    });
    };
  });
  })
  .delete((req, res) => {
  model.Order.remove({
    _id: req.params.orderId
  }, (err, order) => {
    if (err) {
    res.send(err);
    } else {
    res.json({ message: 'Order deleted' });
    };
  });
  });

router.route('/dishes')
  .get((req, res) => {
  model.Dish.find((err, dishes) => {
    if (err) {
    res.send(err);
    } else {
    res.json(dishes);
    };
  });
  });

app.use('/api', router);

server.listen(port, () => {
  console.log(`Application started on port ${port}!`);
});

socketIO.on('connection', (socket) => {

  console.log('User connected');

  socket.on('changeStatus', (order) => {
  socketIO.emit('changeStatus', order);
  });

  socket.on('disconnect', (message) => {
  console.log('User left');
  });

});