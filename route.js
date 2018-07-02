'use strict';

const controller = require('./controller');

const express = require('express');
const bodyParser = require('body-parser');

module.exports = function(app) {

  const router = express.Router();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static(__dirname + '/'));

  router.get('/', controller.openStartPage);

  router.route('/clients')
    .get(controller.getClient)
    .post(controller.createClient);

  router.route('/clients/:client_id')
    .put(controller.updateClient);

  router.route('/orders')
    .get(controller.getOrders)
    .post(controller.createOrder);

  router.route('/orders/:order_id')
    .put(controller.updateOrder)
    .delete(controller.deleteOrder);

  router.route('/dishes')
    .get(controller.getDishes);

  app.use('/api', router);

}

