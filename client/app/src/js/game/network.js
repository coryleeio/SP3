var scene = require('./canvas').scene;
// var World     = require('./_sharedClientSide/ecs/world');
// var DrawingSystem = require('./_sharedClientSide/ecs/systems/drawingSystem');
// var DustSystem = require('./_sharedClientSide/ecs/systems/dustSystem');
// var SkyboxSystem = require('./_sharedClientSide/ecs/systems/skyboxSystem');
// var ExtrapolationSystem = require('./_sharedClientSide/ecs/systems/extrapolationSystem');
// var PlayerInputSystem = require('./_sharedClientSide/ecs/systems/playerInputSystem');
// var gameConstants = require('./_sharedClientSide/config/gameConstants');
var previousTick = Date.now();
var delta;
var now;

// // build world, register systems.
// var world = new World();
// var playerInputSystem = new PlayerInputSystem(world);
// var drawingSystem = new DrawingSystem(playerInputSystem);
// var extrapolationSystem = new ExtrapolationSystem();
// var dustSystem = new DustSystem();
// var skyboxSystem = new SkyboxSystem();

// world.registerSystem(playerInputSystem);
// world.registerSystem(extrapolationSystem);
// world.registerSystem(drawingSystem);	
// world.registerSystem(dustSystem);
// world.registerSystem(skyboxSystem);

var network = {
	connectToGameServer: function(gameUrl) {
		console.log("Connecting to game server at: " + gameUrl);
		var socket = io( gameUrl );
		socket.on('connect', function () {
			console.log("Connected to server.");
			// scene.registerBeforeRender(function() {
			// 	// start main game loop here.
			// 	now = Date.now();
			// 	delta = (now - previousTick) / 1000;
			// 	if (previousTick + gameConstants.stepDelta <= now) {
			// 		previousTick = now;
			// 		// Send player input over socket if i know what entity to control.
			// 		var playerInput = playerInputSystem.getPlayerInput();
			// 		if (playerInput != null) {
			// 			socket.emit('playerInput', playerInput);
			// 		}
			// 		world.step(delta);
			// 	}
			// 	world.update(delta);
			// });
		});

		socket.on('takeControl', function(entityId) {
			playerInputSystem.setPlayerControlledEntity(entityId);
		});

		socket.on('snapshot', function(data) {
			world.receiveSnapshot(world, data);
		});

		socket.on('disconnect', function() {
			console.log("Disconnected from server.");
		});
	}
};
module.exports = network;