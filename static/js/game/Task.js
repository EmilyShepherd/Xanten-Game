/**
 * @file Represents performing task. It is a model object (MCV)
 * @author Cristian Sima and George Salter
 * @version 30.11.2014
 */


/**
 * Represents a performing task
 * @constructor
 * @param {object} data An object with the necessary information regarding the task
 * @param {string} title The title which will be seen in the current tasks
 * @param {object} serverDetails An object with the information regarding the url, type, data to be sent to the server for confirmation
 * @param {function} afterConfirmation A function which is executed after the task is confirmed by server. It use the information from server by using this.confirmationDetails
 * @param {function} beforeEnds A function to be executed after the task is removed
 * @param {string} imgSource The image of the task
 * @property {object} response An object which holds information from server
 * @property {object} data The data of the taks. Usefull to hold variables
 * @property {number} id The id of the task
 * @property {object} serverDetails Information regarding the confirmation from the server
 * @property {object} imgSource The image of the task
 * @property {object} title The title of the task
 * 
 */
function Task(data, title, serverDetails, afterConfirmation, beforeEnds, imgSource){
	
	this.id					= game.tasksCounter;

	this.title        		= title;
	this.data		 		= data;
	this.response			= null;
	this.serverDetails		= serverDetails;
	this.imgSource			= (imgSource?imgSource:"http://clipart.nicubunu.ro/svg/rpg_map/statue.svg");
		
	game.tasksCounter++;
	
	/*
	 * If there is exists an override of the method, call it after it calls the default
	 * If not call the default
	 */
	this._beforeEnds 			= (beforeEnds?beforeEnds:this._beforeEnds);
	this._afterConfirmation		= (afterConfirmation?afterConfirmation:this._afterConfirmation);		
	
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
			"error": function(){HTML_Engine.failTask.content(instance.title, " your people are not now able."); instance.forceStop();}
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
Task.prototype._beforeEnds = function(){	
};

/**
 * @private
 * @memberOf Task.prototype 
 */
Task.prototype._afterConfirmation = function(){
};


/**
 * It is the default function for afterConfirmation. It checks if the server confirmed the task. Else, it stops it
 * @memberOf Task.prototype
 */
Task.prototype.afterConfirmation = function(){
	if(this.response.status === "error" ){ // TODO should be changed to error
		HTML_Engine.failTask.content(this.title, this.response.message);
		this.forceStop();
	} else {		
		this._afterConfirmation(this);
		this.progressTasks.start();
		if(game.currentAction){
			game.currentAction.update();
		}
	}
};

/**
 * It is the default function for beforeEnds. Then, it calls its forceStop method
 * @memberOf Task.prototype 
 */
Task.prototype.beforeEnds = function(){	
	Window.newsBoard.add("<span class='news_done'>Done</span>: " + this.title);
	this._beforeEnds(this);
	this.forceStop();
};

/**
 * It stops the progress bar, removes the task from the game and update the game
 * @memberOf Task.prototype 
 */
Task.prototype.forceStop = function(){
	// remove 
	clearInterval(this.progressTasks.thread);
	$("#task_" + this.id).slideUp();
	this.beforeStarting = function(){
		// force to stop
	};
	game.update();	
	game.removeTask(this);
}