/**
 * @file Represents Game object
 * @author JavaScript Team. Team M
 * @version 3.1.2015
 */

/**
 * The game object. It contains information regarding the maps, current player and map, realTimeEngine. It can perform a task and a action. It stores the tasks
 * @constructor
 * @version 3.1.2015
 * @author Cristian Sima && George Salter && Joe Buckingham
 * @property {object} data Information about game. Please see the response.data object {@link Connection.startGame}
 * @property {Player} player The current player of the game
 * @property {XantenMap} currentMap The current map
 * @property {CityMap} cityMap The city map object
 * @property {WorldMap} worldMap The world map object
 * @property {RTE} RTE The RealTimeEngine object reference 
 * @param {object} data Information about the game
 * @param {Player} player The current player
 * @param {CityMap} cityMap A reference to the city map object
 * @param {WorldMap} worldMap A reference to the world map object      
 * @param {object} tasks A list of tasks which are being performed      
 */
function Game(data, player, cityMap, worldMap, tasks) {
	
	this.data 			= data;
	this.started		= false;
	this.data.tasks 	= tasks;

	this.player = player;

	this.currentMap = null;
	this.cityMap 	= cityMap;
	this.worldMap 	= worldMap;

	this.RTE = new RealTimeEngine();

	this.tasks 			= {};
	this.actions 		= {};
	this.currentTasks 	= [];
	this.currentAction 	= null;
}

/**
 * It loads, inits and creates the game. Should be called ones, else it gives an error. It calls the init method of the maps, the Window. Then, it calls the start method
 * @memberOf Game.prototype
 */
Game.prototype.init = function() {

	if (this.started) {
		alert('The game is already started !');
		return;
	}

	this.started = true;

	// maps
	this.cityMap.init();
	this.worldMap.init();

	// deleloper
	if (developer) {
		this.selectMap(game[developer.settings.defaultMap + "Map"]);
	} else {
		this.selectMap(game.cityMap);
	}

	// graphics part
	Window.init();

	this.start();
	
};

/**
 * It loads the current tasks. It starts the RealTimeEngine.
 * @memberOf Game.prototype
 */
Game.prototype.start = function() {
	Window.update();
	this.RTE.run();

	$("#cover").fadeOut(((DEVELOPER_MODE) ? 10 : 1000), function() {
		// game is ready
	});
};


/**
 * It stops everything. Need to refresh the page in order to re-start the game
 * @memberOf Game.prototype
 */
Game.prototype.freeze = function() {
	game.RTE.freeze();
	game.worldMap.freeze();
	game.cityMap.freeze();
	// TODO @George	 freeze all tasks
	game.performAction('game_over');
}

/**
 * It updates the game. It updates the current action content (by calling the action 'update' method), the content maps
 * @memberOf Game.prototype
 */
Game.prototype.update = function() {


	// update the current action content
	if (this.currentAction) {
		this.currentAction.update();
	}

	// updates the map
	this.worldMap.update();
	this.cityMap.update();
	
	Window.refresh();
};

/**
 * It changes the map of the game. It changes only if the new map is not the same as the current one
 * @memberOf Game.prototype
 * @param {XantenMap} map The map to be changed to
 */
Game.prototype.selectMap = function(map) {

	if (this.currentMap !== map) {

		if (this.currentMap) {
			this.currentMap.hide();
		}

		this.currentMap = map;
		this.removeCurrentAction();
		this.currentMap.select();

		game.performAction(map.name + '-map-selected');
	}
};

/**
 * It performs an action. If there was a previous action, it removes it
 * @memberOf Game.prototype
 * @param {string} name The name of the action (@see game.actions)
 * @param {object} args The arguments for the action
 * @see Action
 */
Game.prototype.performAction = function(name, args) {
	var args = args ? args : undefined;
	if (game.currentAction) {
		game.currentAction.remove(); // execute the code before it is gone
	}
	var action = game.actions[name](args);
	action.setArguments(args);
	game.currentAction = action;
	action.update();
}

/**
 * It removes the current action and clears the actions board
 * @memberOf Game.prototype
 * @see Action
 */
Game.prototype.removeCurrentAction = function() {
	if (game.currentAction) {
		game.currentAction.remove(); // execute the code before it is gone
	}
	game.currentAction = undefined;
	$("#actions_board .inside").html("");
}

/**
 * It loads and activates a task. It removes a possible current action
 * @memberOf Game.prototype
 * @param {string} name The name of the task
 * @param {object} args The arguments for the task
 * @see Task
 * @see Action
 */
Game.prototype.performTask = function(name, args) {

	var args = args ? args : undefined,
		task = game.tasks[name](args);

	task.args = args;
	game.currentTasks.push(task);
};

/**
 * It removes a task from the game
 * @memberOf Game.prototype
 * @param {Task} task The reference to the task to be deleted
 * @see Action
 */
Game.prototype.removeTask = function(task) {
	delete game.currentTasks[task];
}