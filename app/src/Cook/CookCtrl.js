'use strict';

angular
  .module('myApp')
  .controller('CookCtrl', function($scope, CookService) {

    const socket = io();
  
    CookService.getDishes('Ordered').then(data => $scope.orderedDishes = data.data);
  
    CookService.getDishes('Cooking').then(data => $scope.cookingDishes = data.data);
  
  
    $scope.startCooking = function(order, orderIndex) {

      order.status = 'Cooking';
      $scope.orderedDishes.splice(orderIndex, 1);
      $scope.cookingDishes.push(order);
  
      socket.emit('changeStatus', order);
  
      CookService.updateStatus(order._id, 'Cooking').then(data => {});

    };
  
    $scope.finishCooking = function(order, orderIndex) {

      order.status = 'Delivery';
      $scope.cookingDishes.splice(orderIndex, 1);
  
      socket.emit('changeStatus', order);
  
      CookService.updateStatus(order._id, 'Delivery').then(data => {});

    };
  
    socket.on('createOrder', () => {
  
      CookService.getDishes('Ordered').then(data => {

        if (data.data.length) {
          $scope.orderedDishes = data.data;
        };

      });
  
    });

    socket.on('connect_error', () => {

      console.log('Disconnected from server');
      socket.disconnect();

    });

  });


