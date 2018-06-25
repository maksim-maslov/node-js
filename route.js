'use strict';

const controller = require('./controller');

const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(app, socketIO) {

  // const app = express();

  const router = express.Router();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // app.use(express.static(__dirname + '/'));

  router.route('/clients')
    .get(controller.getClient)
    .post(controller.createClient);

  router.route('/clients/:client_id')
    .put(controller.updateClient);

  router.route('/orders')
    .get(controller.getOrders)
    .post((req, res, next, socketIO) => controller.createOrder(req, res, next, socketIO));

  router.route('/orders/:order_id')
    .put((req, res, next, socketIO) => controller.updateOrder(req, res, next, socketIO))
    .delete(controller.deleteOrder);

  router.route('/dishes')
    .get(controller.getDishes);

  app.use('/api', router);

}

