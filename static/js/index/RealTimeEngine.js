/**
 * Represents performing task. It is a view object (MCV)
 *
 * @author Cristian Sima and ...
 * @version 2.12.2014
 */




/**
 * It makes the game alive
 * 
 */
function RealTimeEngine(){
	this.isRunning 	= false;
	this.threads 	= {};
	this.websocket  = undefined;
	
	this.init();
}

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
	
	this.threads.resources = setInterval(_progress, 1000);	
	
	*/
};

/**
 * It loads the WebSocket framework and assign the listeners for events (receive/send message, disasters and statistics) 
 */
RealTimeEngine.prototype.init = function(){	
    // this.channel   = new goog.appengine.Channel('{{ channel_id }}');
};


/**
 * It stops the calculation of resources. It stops the connection with the websocket and removes the listeners
 */
RealTimeEngine.prototype.stop = function(){
	
	this.isRunning = false; 
	
	clearInterval(this.threads.resources);
	
	this.websocket = this.channel.close()
	
    this.websocket.onmessage    = undefined;
    this.websocket.onstatistics = undefined;
    this.websocket.ongamestatus = undefined;
};

/**
 * It is called each second. It updates the amounts of resources
 */
RealTimeEngine.prototype._progress = function(){
	// TODO @Cristian
	
	// game.resources.update();
};


/**
 * it is called in order to send a message to another player
 * @param string message The message to be sent
 * @param number player_id The id of the player
 */
RealTimeEngine.prototype.sendMessage = function(message, player_id){
	// TODO @Joe
};


/**
 * It is called when a message is received for this user
 * @param string message An object which contain all the information regarding the message ("sent_from", "content", "id", "date")
 */
RealTimeEngine.prototype.receiveMessage = function(message){
	// TODO @Joe 
};

/**
 * It is called when the game receives the statistics for a day. It includes disasters
 * @param object statistics The statistics for a day (people, gold, disasters)
 */
RealTimeEngine.prototype.receiveDailyStatistics = function(statistics){
	// TODO @Cristian 
};

/**
 * It is called when server tells the status of the game
 * @param object status It contains the status of the game.
 */
RealTimeEngine.prototype.receiveGameStatus = function(status){
	// TODO @Cristian 
};
