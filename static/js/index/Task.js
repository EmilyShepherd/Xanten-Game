/**
 * @file Represents performing task. It is a model object (MCV)
 * @author Cristian Sima
 * @version 30.11.2014
 */


/**
 * Represents a performing task
 * @constructor
 * @param {object} data An object with the necessary information regarding the task
 * @param {string} title The title which will be seen in the current tasks
 * @param {object} serverDetails An object with the information regarding the url, type, data to be sent to the server for confirmation
 * @param {function} afterConfirmation A function which is executed after the task is confirmed by server. It use the information from server by using this.confirmationDetails
 * @param {function} beforeStarting A function to be executed before the task starts
 * @param {function} duringPerforming A function to be executed during the execution of task
 * @param {function} afterEnds A function to be executed after the task is completed
 * @param {string} imgSource The image of the task
 * @property {object} response An object which holds information from server
 * @property {object} data The data of the taks. Usefull to hold variables
 * @property {number} id The id of the task
 * @property {object} serverDetails Information regarding the confirmation from the server
 * @property {object} imgSource The image of the task
 * @property {object} title The title of the task
 * 
 */
function Task(data, title, serverDetails, afterConfirmation, beforeStarting, duringPerforming, afterEnds, imgSource){
	
	var instance = this;
	
	this.id					= Math.round(Math.random() * (133333 - 10) + 133333);
	this.title        		= title;
	this.data		 		= data;
	this.response			= null;
	this.serverDetails		= serverDetails;
	
	/*
	 * If there is exists an override of the method, call it after it calls the default
	 * If not call the default
	 */
	this.imgSource				= (imgSource?imgSource:"http://clipart.nicubunu.ro/svg/rpg_map/statue.svg");
	
	this._beforeStarting 		= (beforeStarting?beforeStarting:this._beforeStarting);
	this._afterEnds 			= (afterEnds?afterEnds:this._afterEnds);
	this._afterConfirmation		= (afterConfirmation?afterConfirmation:this._afterConfirmation);		
	this._duringPerforming		= (duringPerforming?duringPerforming:this._duringPerforming);
	
	this._activate();
}

/**
 * It is an internal function. Sends the confirmation to server, then it saves the confirmation details, it executes afterConfirmation and beforeStarting methods
 * @private
 * @memberOf Task.prototype
 */
Task.prototype._activate = function(){
	
	var instance = this;
	
	this.progressTasks = new ProgressBar(this);
	
	$.ajax({
			"url": this.serverDetails.url,
			"type": this.serverDetails.type,
			"data": this.serverDetails.data,
			"success": function(response){
							instance.response = response;
							instance.afterConfirmation();
						},
			"error": function(){HTML_Engine.failTask.content(instance.title, " your people are not now able.");}
	});
};

/**
 * It is the default function for duringPerforming. It just shows the progress of the
 * @memberOf Task.prototype 
 */
Task.prototype.duringPerforming = function(){
	this._duringPerforming(this);
}

/**
 * @private
 * @memberOf Task.prototype 
 */
Task.prototype._beforeStarting = function(){	
};

/**
 * @private
 * @memberOf Task.prototype 
 */
Task.prototype._afterEnds = function(){	
};

/**
 * @private
 * @memberOf Task.prototype 
 */
Task.prototype._afterConfirmation = function(){
};

/**
 * @private
 * @memberOf Task.prototype 
 */
Task.prototype._duringPerforming = function(){	
};

/**
 * It is the default function for beforeStarting. It creates the progress bar for this task
 * @memberOf Task.prototype
 */
Task.prototype.beforeStarting = function(){
	this._beforeStarting(this);
	this.progressTasks.start(); 
};

/**
 * It is the default function for afterConfirmation. It checks if the server confirmed the task. Else, it stops it
 * @memberOf Task.prototype
 */
Task.prototype.afterConfirmation = function(){
	if(this.response.status === "er2ror" ){
		HTML_Engine.failTask.content(this.title, this.response.message);
		this.forceStop();
	} else {		
		this._afterConfirmation(this);
		this.beforeStarting();
	}
};

/**
 * It stops the progress bar, removes the task from the game and update the game
 * @memberOf Task.prototype 
 */
Task.prototype.forceStop = function(){
	// remove 
	clearInterval(this.progressTasks.thread);
	$("#task_" + this.id).slideUp();
	game.removeTask(this);
	game.update();	
}

/**
 * It is the default function for afterEnds. Then, it calls its forceStop method
 * @memberOf Task.prototype 
 */
Task.prototype.afterEnds = function(){	
	Window.newsBoard.add("<span class='news_done'>Done</span>: " + this.title);
	this._afterEnds(this);
	this.forceStop();
};