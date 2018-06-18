'use strict';

angular
.module('myApp')
.factory('ClientService', function ($http) {

  return {

    getUser: function(user) {
      let config = {
        params: {
          name: user.name,
          email: user.email
        }
      };
      return $http.get('/api/clients', config);
    },

    createUser: function(user) {
      let userData = {
        name: user.name,
        email: user.email
      };

      return $http({
        method: 'POST',
        url: '/api/clients',
        data: userData
      });
    },

    updateBalance: function(userid, newbalance) {
      let userData = {
        balance: newbalance
      };

      return $http({
        method: 'PUT',
        url: '/api/clients/' + userid,
        data: userData
      });
    },

    getOrders: function(userid) {
      let config = {
        params: {
          userId: userid
        }
      };
      return $http.get('/api/orders', config);
    },

    getDishes: function() {
      return $http.get('/api/dishes');
    },

    createOrder: function(userid, dishid) {
      let orderData = {
        userId: userid,
        dishId: dishid
      };

      return $http({
        method: 'POST',
        url: '/api/orders',
        data: orderData
      });
    },

    updateStatus: function(orderid, newStatus) {
      let orderData = {
        status: newStatus
      };

      return $http({
        method: 'PUT',
        url: '/api/orders/' + orderid,
        data: orderData
      });
    }
  }
  
});
