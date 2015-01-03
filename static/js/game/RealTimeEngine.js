/**
 * @file It does the magic of the game. It maintain the connection with the server, it progress any websockets and it progress the resources
 * @author Cristian Sima
 * @version 30.12.2014
 */

/**
 * It does the magic of the game. It maintain the connection with the server, it progress any websockets and it progress the resources.
 * @constructor
 * @property {boolean} isRunning If true, the RTE is running, false otherwise
 * @property {object} websocket The reference to the websocket object
 */
function RealTimeEngine(){
	this.isRunning 	= false;
	this.threads 	= {};
	this.websocket  = undefined;
	this.init();
}


/**
 * It loads the WebSocket framework and assign the listeners for events (receive/send message, disasters and statistics)
 * @private
 * @memberOf RealTimeEngine.prototype
 */
RealTimeEngine.prototype.init = function(){
    // this.channel   = new goog.appengine.Channel('{{ channel_id }}');
};

/**
 * It stats the thread for resources, starts the channel for websocket and assigns the listeners
 * @memberOf RealTimeEngine.prototype
 */
RealTimeEngine.prototype.run = function(){

	var instance = this;

	if(this.isRunning){
		alert('RealTimeEngine is already running');
		return;
	}

	this.isRunning = true;

	/*
	 *
	this.websocket = channel.open()

    this.websocket.onmessage = function(evt) {
    	instance.receiveMessage(evt);
    }

    this.websocket.onstatistics = function(statistics) {
    	instance.receiveDailyStatistics(statistics);
    }

    this.websocket.ongamestatus = function(status) {
    	instance.receiveGameStatus(status);
    }
    */
	instance._progress();
	this.threads.resources = setInterval(instance._progress, 1000);
};

/**
 * It stops the calculation of resources. It stops the connection with the websocket and removes the listeners
 * @memberOf RealTimeEngine.prototype
 */
RealTimeEngine.prototype.freeze = function(){

	this.isRunning = false;

	clearInterval(this.threads.resources);

	// this.websocket = this.channel.close()

    // this.websocket.onmessage    = undefined;
    // this.websocket.onstatistics = undefined;
    // this.websocket.ongamestatus = undefined;
};

/**
 * It is called each second. It updates the amounts of resources
 * @memberOf RealTimeEngine.prototype
 * @private
 */
RealTimeEngine.prototype._progress = function(){
	// food 
	game.player.resources.food 	+= parseInt(game.constructions.buildings.farm.capacity(game.player.city.buildings.farm.level).resources.food);
	game.player.resources.food 	+= parseInt(game.constructions.buildings.mill.capacity(game.player.city.buildings.mill.level).resources.food);
	// wood
	game.player.resources.wood 	+= parseInt(game.constructions.buildings.lumberjack.capacity(game.player.city.buildings.lumberjack.level).resources.wood);
	// stone
	game.player.resources.stone += parseInt(game.constructions.buildings.mine.capacity(game.player.city.buildings.mine.level).resources.stone);
	
	Window.updateResources();
};


/**
 * it is called in order to send a message to another player
 * @memberOf RealTimeEngine.prototype
 * @param {string} message The message to be sent
 * @param {number} player_id The id of the player
 */
RealTimeEngine.prototype.sendMessage = function(message, player_id){
	// TODO @Joe
	// Censor obscenities
	message = message.replace(/[A-Z]*(bastard|bitch|cock|cunt|dick|faggot|fuck|nigger|pussies|pussy|rape|shit|slut)[A-Z]*/ig, function(match) {
		var returnstring = "";
		for (var i=0; i < match.length; i++){returnstring += '*';}
		return returnstring;
	});
	return {
		sent_from: game.player.id,
		content: message,
		id: player_id,
		date: new Date()
	}
};


/**
 * It is called when a message is received for this user
 * @memberOf RealTimeEngine.prototype
 * @param {string} message An object which contain all the information regarding the message ("sent_from", "content", "id", "date")
 */
RealTimeEngine.prototype.receiveMessage = function(message){
	// TODO @Joe 
};


/**
 * It is called when a message is received for this user
 * @memberOf RealTimeEngine.prototype
 * @param {string} message An object which contain all the information regarding the message ("sent_from", "content", "id", "date")
 */
RealTimeEngine.prototype.receiveAttack = function(message){
	// TODO @Joe
};


/**
 * Perform an attack
 * @param {object} data Information regarding the attack
 * @memberOf RealTimeEngine.prototype
 */
RealTimeEngine.prototype.performAttack = function(data){
	// TODO @Cristian send socket
};

/**
 * It is called when the game receives the statistics for a day. It includes disasters
 * @memberOf RealTimeEngine.prototype
 * @param {object} statistics The statistics for a day (number of free people, gold)
 */
RealTimeEngine.prototype.receiveDailyStatistics = function(statistics){
	game.player.resources.gold 							= statistics.gold;
	game.player.city.buildings.administration.people 	= statistics.people;
};

/**
 * It is called when server tells the status of the game
 * @memberOf RealTimeEngine.prototype
 * @param {string} status It contains the status of the game. If it is lost, it stops the game
 */
RealTimeEngine.prototype.receiveGameStatus = function(status){
	if(status === 'lost') {
		game.performAction("game_over");
		game.freeze();
	}
};