/**

 * The game object
 *
 * @author Cristian Sima
 * @version 30.12.2014
 */
function Game(data, player, cityMap, worldMap) {

	this.data = data;

	this.player = player;

	this.currentMap = null;
	this.cityMap = cityMap;
	this.worldMap = worldMap;

	this.RTE = new RealTimeEngine();

	this.tasks = {};
	this.actions = {};
	this.currentTasks = [];
	this.currentAction = null;
}

/**
 * It creates and starts the game. Should be called ones, else it gives an error
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
	
	var value = ((developer.settings.developerMode) ? 10 : 1000)
	$("#cover").fadeOut(value, function() {
	// game is ready
	});
};

/**
 * It loads the current tasks. It starts the RealTimeEngine.
 */
Game.prototype.start = function() {
	Window.update();
	this.RTE.run();
};


/**
 * It stops everything. Need to refresh the page in order to re-start the game
 */
Game.prototype.freeze = function() {
	game.RTE.freeze();
	game.worldMap.freeze();
	game.cityMap.freeze();
	// freeze all tasks
	// TODO @George	
	game.performAction('game_over');
}

/**
 * It updates the game. It updates the current action content (by calling the action 'update' method), the content maps
 */
Game.prototype.update = function() {

	// updates the map
	this.worldMap.render();
	this.cityMap.render();

	// update the current action content
	if (this.currentAction) {
		this.currentAction.update();
	}

	this.resources.updateStatistics();
};

/**
 * It changes the map of the game. It changes only if the new map is not the same as the current one
 * @param XantenMap map The map to be changed to
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
 * @param name The name of the action (@see game.actions)
 * @param args The arguments for the action
 * @see Action
 */
Game.prototype.performAction = function(name, args) {
	var args = args ? args : undefined;
	if (game.currentAction) {
		game.currentAction.remove(); // execute the code before it is gone
	}
	var action = game.actions[name](args);
	action.args = args;
	game.currentAction = action;
	action.perform();
}

/**
 * It removes the current action and clears the actions board
 */
Game.prototype.removeCurrentAction = function() {
	if (game.currentAction) {
		game.currentAction.remove(); // execute the code before it is gone
	}
	game.currentAction = undefined;
	$("#actions_board .inside").html("");
}


Game.prototype.performTask = function(name, args) {

	var args = args ? args : undefined,
		task = game.tasks[name](args);

	game.performAction("start_task");
	task.args = args;
	game.currentTasks.push(task);


	// TODO @George uncomment the next line when you have done the task id

};

Game.prototype.removeTask = function(task) {
	delete game.currentTasks[task];
}