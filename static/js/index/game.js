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
function Game(token, player, cityMap, worldMap){
	
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

	this.selectMap(game.cityMap);

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
	 *  String library 
	 */
	String.prototype.capitalize = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	}	  
	
	Number.prototype.formatNumber = function(decPlaces) {
	    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces;
	    decSeparator = ".";
	    thouSeparator = " ";

	    var n = this.toFixed(decPlaces);
	    if (decPlaces) {
	        var i = n.substr(0, n.length - (decPlaces + 1));
	        var j = decSeparator + n.substr(-decPlaces);
	    } else {
	        i = n;
	        j = '';
	    }

	    function reverse(str) {
	        var sr = '';
	        for (var l = str.length - 1; l >= 0; l--) {
	            sr += str.charAt(l);
	        }
	        return sr;
	    }

	    if (parseInt(i)) {
	        i = reverse(reverse(i).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator));
	    }
	    return i+j;
	};
	    
	
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
	this.RTE.run();
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
 * It updates the game. It updates the current action content (by calling the action 'update' method), the content maps
 */
Game.prototype.update = function() {	
	
	// updates the map
	this.worldMap.render();
	this.cityMap.render();
	
	// update the current action content
	this.currentAction.update();
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
			player.resources.resource -= resourcesToConsume[resource];
		}
	}
	Game.resources.updateResources();
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
	var action = game.actions[name];
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

/**
 * It loads the list of the actions for the game
 * @see Action
 */
Game.prototype.loadActions = function() {
	game.actions = {
			"available_buildings" 		: new Action("Create a building", HTML_Engine.getAvailableBuildings, function(){game.currentMap.deselect();} ),
			"selectCity" 				: new Action("Actions city", HTML_Engine.selectCity, function(){game.worldMap.deselect();} ),
			"sendMessage" 				: new Action("Send Message", HTML_Engine.sendMessage, function(){game.worldMap.deselect();} ),
			"tradeResources" 			: new Action("Trade resources", HTML_Engine.trade, function(){game.worldMap.deselect();} ),
			"attackCity" 				: new Action("Starting the attack", HTML_Engine.attackCity, undefined ),
			"city-map-selected" 		: new Action("Your city", HTML_Engine.cityMapSelected, undefined),
			"world-map-selected" 		: new Action("World map", HTML_Engine.worldMapSelected, undefined, {
																				"url":"/game/", /* should be the address of the world map*/
																				"cb":function(information){/*change world map*/game.worldMap.render();}
																				}),
			"no_action" 				: new Action("No action", HTML_Engine.noAction, undefined  ),
			"inside_building_military"	: new Action("Military", HTML_Engine.insideMilitary, function(){game.currentMap.deselect();}  ),
			"start_task"				: new Action("Actions", HTML_Engine.loadAction, undefined)
	};	
};


Game.prototype.performTask= function(name, args){
	
	// TODO - @George register the task with progressbars 
		
	game.performAction("start_task");
	
	// TODO @George uncomment the next line when you have done the task id
	// game.currentTasks.push(game.tasks[name](args).id); 
};

/**
 * It loads the list of the actions for the game
 * @see Action
 */
Game.prototype.loadTasks = function() {
	game.tasks = {
			"move_people" 		: function(args){
													//  TODO @George to create the task
													alert("You want to move from "+args.from+" to "+args.to+" a number of "+args.number);
													
													return null;
												},
			"attack_city_1"		: function(args){
													return null;
												}
	};	
};