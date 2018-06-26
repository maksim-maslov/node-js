'use strict';

angular
  .module('myApp')
  .factory('CookService', function ($http) {
    
    return {
  
      getOrders: function(dishStatus) {

          const config = {
              params: {
                  status: dishStatus
              }
          };

          return $http.get('/api/orders', config);
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
      },

      deleteOrder: function(orderid){
        let orderData = {
            orderId: orderid
        };

        return $http({
            method: 'DELETE',
            url: '/api/orders/' + orderid,
            data: orderData
        });
      }

    }

  });



