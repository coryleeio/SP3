var auth   = require('./auth');
var Room   = require('./room');
var _      = require('underscore');
var serverConfig = require('../config/serverConfig');
var matchmaking = require('./matchmaking');

module.exports.routes = function(app, io) {
  var rooms = {};
  var roomsByClientId = {};
  _.each(_.range(serverConfig.roomsPerServer), function(id)  {
    rooms[id] = new Room(io, id);
  });

  io.on('connection', function(client){
    if(client.request.user.logged_in) {
      console.log('User: ' + client.request.user.google.email + ' has connected.');
    }
    else {
      console.log('An anonymous user has connected.');
    }
    var room = matchmaking.findRoom(client, rooms);
    if(room != null) {
      room.join(client);
      roomsByClientId[client.id] = room;
    }
    else{
      console.log("No room was available to join!");
    }

    client.on('playerInput', function(playerInput){
      room.game.updateClientInput(client.id, playerInput);
    });

    client.on('disconnect', function(){
      roomsByClientId[client.id].leave(client);
      roomsByClientId[client.id] = null;
      if(client.request.user != null && client.request.user.google != null)
      {
        console.log('User: ' + client.request.user.google.email + ' has disconnected.');
      }
      else
      {
        console.log('An anonymous user has disconnected');
      }
    });
  });
};

module.exports.sendSnapshot = function(room ) {
  room.io.sockets.in(room.id).emit('snapshot', room.game.world.getSnapshot());
}