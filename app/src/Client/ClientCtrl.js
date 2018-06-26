'use strict';

angular
  .module('myApp')
  .controller('ClientCtrl', function($scope, ClientService) {

  $scope.isLogin = false;
  $scope.isShowDishes = false;
  $scope.dishes = [];
  $scope.userOrders = [];
  const socket = io();

  $scope.login = function(user) {

    $scope.isLogin = true;

    $scope.user = user;

    ClientService.getUser($scope.user).then(data => {

      if (data.data.length) {

        $scope.user = data.data[0];

        ClientService.getOrders($scope.user._id).then(data => {

          if (data.data.length) {
            $scope.userOrders = data.data;
          };

        });

      } else {

        $scope.user.balance = 100;

        ClientService.createUser($scope.user).then(data => $scope.user = data.data);
        
      }

    });
  };

  $scope.depositeAccount = function() {

    $scope.user.balance = $scope.user.balance + 100;

    ClientService.updateBalance($scope.user._id, $scope.user.balance).then(data => {});

  };

  $scope.showDishes = function() {

    $scope.isShowDishes = true;

    ClientService.getDishes().then(data => $scope.dishes = data.data);

  };

  $scope.addDish = function(id, title, price) {

    $scope.user.balance = $scope.user.balance - price;

    ClientService.updateBalance($scope.user._id, $scope.user.balance).then(data => {});

    ClientService.createOrder($scope.user._id, id).then(data => {});

  }; 


  socket.on('createOrder', () => {

    ClientService.getOrders($scope.user._id).then(data => {

      if (data.data.length) {
        $scope.userOrders = data.data;
      }

    });

  });

  socket.on('deleteOrder', () => {
  
    ClientService.getOrders($scope.user._id).then(data => {

      if (data.data.length) {
        $scope.userOrders = data.data;
      }

    });

  });  

  socket.on('changeStatus', order => {    

    $scope.userOrders.forEach(el => {
      if (el._id == order._id) {
        el.status = order.status;
        $scope.$apply();         
      }
    });
    
  });

  socket.on('connect_error', () => {

    console.log('Disconnected from server');
    socket.disconnect();

  });

});
