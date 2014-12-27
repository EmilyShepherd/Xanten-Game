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
	// TODO @Cristian


	/*
	game.player.resources.food  += (game.player.buildings.dock.people * game.player.buildings.dock.level);
	game.player.resources.food  += (game.player.buildings.grapevine.people * game.player.buildings.grapevine.level);

	game.player.resources.wood  += Math.round(0.3 *
								parseInt(game.player.buildings.lumberjack.num *
								parseInt(game.player.buildings.lumberjack.people) *
								parseInt(game.player.buildings.lumberjack.level) ));


	  * self.lumberjackLvl
	  * self.peopleAtLumberjack
	  * self.lumberjacks
	  * secs / 60.0
	self.stone +=
	    (random.randrange(1, 19) / 10.0) * 0.3
	  * self.mineLvl
	  * self.peopleAtMine
	  * self.mines
	  * secs / 60.0
	self.gold +=
	    (random.randrange(1, 19) / 10.0) * 0.3
	  * self.mineLvl
	  * self.peopleAtMine
	  * self.goldMines
	  * secs / 60.0

	game.player.resources.stone -= 276;
	game.player.resources.food 	+= 132;
	game.player.resources.wood 	+= 2;
	*/
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
 * @param {string} id_city The id of the city which is attacked
 * @memberOf RealTimeEngine.prototype
 */
RealTimeEngine.prototype.performAttack = function(id_city){
	// TODO @Cristian
};

/**
 * It is called when the game receives the statistics for a day. It includes disasters
 * @memberOf RealTimeEngine.prototype
 * @param {object} statistics The statistics for a day (people, gold, disasters)
 */
RealTimeEngine.prototype.receiveDailyStatistics = function(statistics){
	// TODO @Cristian
};

/**
 * It is called when server tells the status of the game
 * @memberOf RealTimeEngine.prototype
 * @param {object} status It contains the status of the game.
 */
RealTimeEngine.prototype.receiveGameStatus = function(status){
	// TODO @Cristian
};
