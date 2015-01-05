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
function RealTimeEngine(token) {
	this.isRunning = false;
	this.threads = {};
	this.websocket = undefined;

	if (token)
		this.init(token);
}


/**
 * It loads the WebSocket framework and assign the listeners for events (receive/send message, disasters and statistics)
 * @private
 * @memberOf RealTimeEngine.prototype
 */
RealTimeEngine.prototype.init = function(token) {
	this.channel = new goog.appengine.Channel(token);
	this.socket = this.channel.open();
	this.socket.RTE = this;
	this.socket.onopen = this.onopen;
	this.socket.onmessage = this.onmessage;
	this.socket.onerror = this.onerror;
	this.socket.onclose = this.onclose;
};

RealTimeEngine.prototype.onmessage = function(data) {
	data = JSON.parse(data.data);

	this.RTE[data.call](data.data);
};

RealTimeEngine.prototype.onopen = function() {
	this.RTE.connected = true;
};

RealTimeEngine.prototype.onerror = function(error) {
	console.error(error.description);
};

RealTimeEngine.prototype.onclose = function() {
	this.RTE.connected = false;
};



/**
 * It stats the thread for resources, starts the channel for websocket and assigns the listeners
 * @memberOf RealTimeEngine.prototype
 */
RealTimeEngine.prototype.run = function() {

	var instance = this;

	if (this.isRunning) {
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
RealTimeEngine.prototype.freeze = function() {

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
RealTimeEngine.prototype._progress = function() {
	// food 
	game.player.resources.food += parseInt(game.constructions.buildings.farm.capacity(game.player.city.buildings.farm.level).resources.food);
	// wood
	game.player.resources.wood += parseInt(game.constructions.buildings.lumberjack.capacity(game.player.city.buildings.lumberjack.level).resources.wood);
	// stone
	game.player.resources.stone += parseInt(game.constructions.buildings.mine.capacity(game.player.city.buildings.mine.level).resources.stone);

	Window.updateResources();
};


/**
 * It is called when a message is received for this user. It saves the message. It sends a notification and it updates the window
 * @memberOf RealTimeEngine.prototype
 * @param {string} message An object which contain all the information regarding the message ("sent_from", "content", "id", "date")
 */
RealTimeEngine.prototype.receiveMessage = function(message) {
	var msg = {	id: game.player.messages.length, content: message.message, from: message.from };
	game.player.messages.push(msg);
	Window.newsBoard.add("<span class='news_done'>New message</span> from " + game.worldMap.getCityById(msg.from) + ": <i>" + ((msg.content.length > 25)?(msg.content.substring(0, 25) + "..."):msg.content) + "</i>");
	game.update();
};


/**
 * It is called when a message is received for this user
 * @memberOf RealTimeEngine.prototype
 * @param {string} message An object which contain all the information regarding the message ("sent_from", "content", "id", "date")
 */
RealTimeEngine.prototype.receiveAttack = function(message) {
	// TODO @Joe
};

/**
 * It gives the result regarding an attack
 * @param {object} msg Result about the attack
 */
RealTimeEngine.prototype.attackResult = function(msg) {
	alert(msg.text);
};

/**
 * It is called when the game receives the statistics for a day. It includes disasters
 * @memberOf RealTimeEngine.prototype
 * @param {object} statistics The statistics for a day (number of free people, resources.gold)
 */
RealTimeEngine.prototype.receiveDailyStatistics = function(statistics) {
	Window.newsBoard.add("<span class='news_done'>Done</span>:  Daily statistics: <br />" + HTML_Engine.content.displaysResources(statistics));
	game.player.resources.gold = statistics.resources.gold;
	game.player.city.buildings.administration.people = statistics.people;
};

/**
 * It is called when server tells the status of the game
 * @memberOf RealTimeEngine.prototype
 * @param {string} status It contains the status of the game. If it is lost, it stops the game
 */
RealTimeEngine.prototype.receiveGameStatus = function(status) {
	if (status === 'lost') {
		game.performAction("game_over");
		game.freeze();
	}
};