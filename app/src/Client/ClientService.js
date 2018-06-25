'use strict';

angular
.module('myApp')
.factory('ClientService', function ($http) {

  return {

    getUser: function(user) {

      const config = {
        params: {
          name: user.name,
          email: user.email
        }
      };

      return $http.get('/api/clients', config);

    },

    createUser: function(user) {

      const userData = {
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

      const userData = {
        balance: newbalance
      };

      return $http({
        method: 'PUT',
        url: '/api/clients/' + userid,
        data: userData
      });

    },

    getOrders: function(userid) {

      const config = {
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
      
      const orderData = {
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

      const orderData = {
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
