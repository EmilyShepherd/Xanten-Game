/**

 * The game object
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */
 


/**
 * The game object.
 * @param token The token of the game
 * @param player Information regarding the player
 * @param XantenMap cityMap A XantenMap object which contain information regarding the city
 * @param XantenMap worldMap A XantenMap object which contain information regarding the city 
 */
function Game(data, token, player, cityMap, worldMap){
	
	this.data             = data;
	this.token             = token;
	this.started           = false;
	this.player            = player;

	this.currentMap        = null;			// nothing
	this.cityMap           = cityMap;
	this.worldMap          = worldMap;
	this.resources         = new Resources();
	this.RTE               = new RealTimeEngine();

	this.currentAction     = null;

	this.actionsBoard      = new Board("actions");
	this.newsBoard         = new Board("news");
	this.currentTasksBoard = new Board("tasks");
	
	
	this.currentProgressTasks		= {};
}

/**
 * It changes the map of the game. It changes only if the new map is not the same as the current one
 * @param XantenMap map The map to be changed to
 */
Game.prototype.selectMap = function(map){
	
	if(this.currentMap !== map){
		
		if(this.currentMap){
			this.currentMap.hide();
		}
		
		this.currentMap = map;
		this.removeCurrentAction();		
		this.currentMap.select();
		
		game.performAction(map.name+'-map-selected');	
	}
};

/**
 * It creates and starts the game. Should be called ones, else it gives an error
 */
Game.prototype.init = function() {

	if(this.started){
		alert('The game is already started !');
		return;
	}
	
	this.started = true;

	this.loadActions();
	this.loadTasks();
	
	// maps
	this.cityMap.init();
	this.worldMap.init();

	if(settings.developerMode){
		this.selectMap(game[settings.defaultMap+"Map"]);
	}
	else {
		this.selectMap(game.cityMap);		
	}

	// graphics part
	this.render();

	window.scrollTo(0,0);		
	
	$(window).resize(game.render);
	$("#map-view" ).buttonset();
	$('#map-view :radio').change(function () {	    
		game.selectMap(game[$('#map-view :radio:checked').val()+"Map"]);
	});
	
	// Fix JQuery problem with tooltip
    $( document ).tooltip({
		position: {
			my: "right bottom+50"
		},
		tooltipClass: "entry-tooltip-positioner",
		track: true  
    });
	
	
	    
	
	/*
	 * the next content is just for now/testing
	 */ 
	
	$("#news_clear").click(function(){
		game.newsBoard.clear();
	});
	
	game.newsBoard.add("You have a new message ! <span id='message' class='hover link'>Read it</span>");
	$("#message").click(function(){
		// demonstrates the use of an action with arguments
		game.performAction("seeMessage", {id:3,content:"How are you"});
	});
	
	this.start();
};

/**
 * It loads the current tasks. It starts the RealTimeEngine.
 */
Game.prototype.start = function(){

	this.loadCurrentTasks();
	this.resources.updateStatistics();
	this.resources.updateResources();
	this.resources.updateDetailsCity();
	this.RTE.run();
};


/**
 * It stops everything. Need to refresh the page in order to re-start the game
 */
Game.prototype.freeze = function(){
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
	if(this.currentAction){
		this.currentAction.update();
	}
	
	this.resources.updateStatistics();
};

/**
 * It loads and creates the current tasks
 */
Game.prototype.loadCurrentTasks = function(){
	// TODO @George - to load and create the current tasks
};

/**
 * It renders the game according to the size of the browser
 */
Game.prototype.render = function() {
	
	$("#actions_board").css({"height":1+"px", "min-height": 1+"px"});
	$("#news_board").css({"height":1+"px", "min-height": 1+"px"});
	$("#tasks_board").css({"height":1+"px", "min-height": 1+"px"});
	
	var height = $(document).height();
	
	var heightForOneBoard = height-245;
	var heightForTwoBoards = (height-(105+135*2))/2;
	
	$("#actions_board").css({"height":heightForOneBoard+"px", "min-height": heightForOneBoard+"px"});
	$("#news_board").css({"height":heightForTwoBoards+"px", "min-height": heightForTwoBoards+"px"});
	$("#tasks_board").css({"height":heightForTwoBoards+"px", "min-height": heightForTwoBoards+"px"});	
};



/**
 * It creates a progress bar task
 * @deprecated see game.performTask
 */
Game.prototype.createProgressBar = function(task_object){
	// TODO @George - please see game.performTask
	this.currentProgressTasks[task_object] = new ProgressBar(task_object);
};


/**
 * It stops and removes a progress.
 * @deprecated see game.performTask
 */
Game.prototype.removeProgressBar = function(task_object){
	this.currentProgressTasks[task_object].remove();
	delete this.currentProgressTasks[task_object];
};

// TODO @Joe need comments
Game.prototype.consumeResources = function(resourcesToConsume){
	for(resource in resourcesToConsume){
		if(resource !== 'seconds' && resource !== 'people' ){
			game.player.resources[resource] -= resourcesToConsume[resource];
		}
	}
	game.resources.updateResources();
};

/**
 * It performs an action. If there was a previous action, it removes it
 * @param name The name of the action (@see game.actions)
 * @param args The arguments for the action
 * @see Action
 */
Game.prototype.performAction = function(name, args){
	var args = args?args:undefined;
	if(game.currentAction){
		game.currentAction.remove();		// execute the code before it is gone
	}
	var action = game.actions[name](args);
	action.args = args;
	game.currentAction = action; 
	action.perform();
}

/**
 * It removes the current action and clears the actions board
 */
Game.prototype.removeCurrentAction = function(){
	if(game.currentAction){
		game.currentAction.remove();		// execute the code before it is gone
	}
	game.currentAction = undefined;
	$("#actions_board .inside").html("");
}


Game.prototype.performTask= function(name, args){
	
	var args = args?args:undefined,
		task = game.tasks[name](args);		

	game.performAction("start_task");	
	task.args = args;	
	game.currentTasks.push(task);
	
	
	// TODO @George uncomment the next line when you have done the task id
	 
};

Game.prototype.removeTask = function(task){
	delete game.currentTasks[task];
}

/**
 * It loads the list of the actions for the game
 * @see Action
 */
Game.prototype.loadActions = function() {
	
	game.currentTasks = [];
	
	game.actions = {
			"game_over"			 		: function(args){ return new Action("Actions", HTML_Engine.gameOver, function(){game.currentMap.deselect();} ); },
			"available_buildings" 		: function(args){ return new Action("Create a building", HTML_Engine.getAvailableBuildings, function(){game.currentMap.deselect();} ); },
			"selectCity" 				: function(args){ return new Action("Actions city", HTML_Engine.selectCity, function(){game.worldMap.deselect();} ); console.log("da");},
			"sendMessage" 				: function(args){ return new Action("Send Message", HTML_Engine.sendMessage, function(){game.worldMap.deselect();} ); },
			"tradeResources" 			: function(args){ return new Action("Trade resources", HTML_Engine.trade, function(){game.worldMap.deselect();} ); },
			"attackCity" 				: function(args){ return new Action("Starting the attack", HTML_Engine.attackCity, undefined ); },
			"city-map-selected" 		: function(args){ return new Action("Your city", HTML_Engine.cityMapSelected, undefined); },
			"world-map-selected" 		: function(args){ return new Action("World map", HTML_Engine.worldMapSelected, undefined, {
																				"url":"/game/", /* should be the address of the world map*/
																				"cb":function(information){/*change world map*/game.worldMap.render();}
																				}); },
			"no_action" 				: function(args){ return new Action("No action", HTML_Engine.noAction, undefined  ); },
			"start_task"				: function(args){ return new Action("Actions", HTML_Engine.loadAction, undefined); },
			"clear"						: function(args){ return new Action("Actions", "", undefined); },
			"inside_building"			: function(args){ return new Action(HTML_Engine.getBuilding.name(args.name, game.player.level),
													(function() { var name = args.name; if(game.player.buildings[name].status === 'under_construction'){ return HTML_Engine.buildingUnderConstruction; } else { return HTML_Engine["inside_"+args.name];} })(),
													function(){game.currentMap.deselect();}  )}
	};	
};



/**
 * It loads the list of the actions for the game
 * @see Action
 */
Game.prototype.loadTasks = function() {
	game.tasks = {
			"train_military" 		: function(args){
													
												},
			"create_building"		: function(args){
											var data			= {},
										 	imageSource 	= $(args).children('img').attr("src");
											 	data["building"] 	= $(args).attr("building_name");
											 	
											
											return new Task(data, 
													'Create building ' + data["building"],
													{
														"url": '/me/building/' + data["building"]  + '/build',
														"type": 'GET'						
													},
													function(task){
														// create building
														if(task.data.building !== "house") {
															game.player.buildings[task.data.building].level 	= 1;
														}
														game.player.buildings[task.data.building].status 	= 'under_construction';
														var c = game.cityMap.getSelectedCell();
														game.cityMap.array[c.x][c.y].type_construction = "building";
														game.cityMap.array[c.x][c.y].id_construction = game.getBuildingDataByName(task.data.building).id;
														game.cityMap.update(); // change the status of the city map
														game.consumeResources(game.resources.getNecessaryForBuilding(task.data["building"], 'create'));
													}, 
													undefined, 
													undefined, 
													function(task){
														game.player.buildings[task.data.building].num++;
														game.player.buildings[task.data.building].status = 'Done';
													},
													imageSource);
										}
	};	
};


Game.prototype.getOrganizationInformationByLevel = function(what, level_of_city){
	
	var info = {},
		level = parseInt(level_of_city);
	
	if(level <=4){
		info = { 
					name: "Hamlet",
					administration: "Foyer",
					house: "Neighbourhood",
					period: "Ancient Time"
		};
	} else 
	if(level >= 5 && level <= 9){
		info = { 
					name: "Village",
					administration: "Village Hall",
					house: "Cul-de-sac",
					period: "Medieval Age"
		};
	} else 
	if(level >= 10 && level <= 14){
		info = { 
					name: "Town",
					administration: "Town Square",
					house: "Residential Area",
					period: "Classical Era"
						
		};
	} else 
	if(level >= 15 && level <= 19){
		info = { 
					name: "City",
					administration: "City Hall",
					house: "Borough",
					period: "Industrial Period"
		};
	} else
	if(level >= 20 && level <= 49){
		info = {
					name: "Metropolis",
					administration: "Metropolis Hall",
					house: "District",
					period: "Modern History"
		};
	} else {
		info = {
					name: "Magapolis",
					administration: "Government",
					house: "Region",
					period: "Contemporary Period"
		}
	}
	
	return info[what];
};


Game.prototype.getBuildingDataByName = function(name){
	for(b in game.data.city_map_buildings){
		
		if(game.data.city_map_buildings[b].name === name){
			return game.data.city_map_buildings[b];
		}
	}
};