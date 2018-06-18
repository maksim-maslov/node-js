'use strict';

angular
  .module('myApp')
  .controller('ClientCtrl', function($scope, ClientService) {

  $scope.isLogin = false;
  $scope.isShowDishes = false;
  $scope.dishes = [];
  let socket = io();

  $scope.login = function(user) {
    $scope.isLogin = true;

    $scope.user = user;

    ClientService.getUser($scope.user).then(function(data) {

      if (data.data.length == 0) {
      $scope.user.balance = 100;

      ClientService.createUser($scope.user).then(function(data) {
        $scope.user = data.data;
      });
      } else {
      $scope.user = data.data[0];

      ClientService.getOrders($scope.user._id).then(function(data) {
        if (data.data.length) {
          $scope.userOrders = data.data;
        };
      });
      }
    });
  };

  $scope.depositeAccount = function() {
  $scope.user.balance = $scope.user.balance + 100;

  ClientService.updateBalance($scope.user._id, $scope.user.balance).then(function(data) {});
  };

  $scope.showDishes = function() {
  $scope.isShowDishes = true;

  ClientService.getDishes().then(function(data) {
    $scope.dishes = data.data;
  });
  };

  $scope.addDish = function(id, title, price) {
  $scope.user.balance = $scope.user.balance - price;

  ClientService.updateBalance($scope.user._id, $scope.user.balance).then(function(data) {});

  ClientService.createOrder($scope.user._id, id).then(function(data) {});
  }; 


  socket.on('createOrder', function(){
  ClientService.getOrders($scope.user._id).then(function(data) {
    if(data.data.length !== undefined) {
    $scope.userOrders = data.data;
    };
  });
  });

  

  socket.on('changeStatus', function(order) {
  for (let c = 0; c < $scope.userOrders.length; c++) {
    if ($scope.userOrders[c]._id == order._id) {
    $scope.userOrders[c].status = order.status;
    $scope.$apply();
    break;
    }
  };
  });

  socket.on('errorConnect', function() {
  console.log('Disconnected from server');
  socket.disconnect();
  });

});
