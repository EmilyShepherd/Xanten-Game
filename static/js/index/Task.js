/**
 * Represents performing task. It is a model object (MCV)
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */



/**
 * Represents a performing task
 * @param object information An object with the necessary information regarding the task
 * @param string title The title which will be seen in the current tasks
 * @param object serverDetails An object with the information regarding the url, type, data to be sent to the server for confirmation
 * @param function afterConfirmation A function which is executed after the task is confirmed by server. It use the information from server by using this.confirmationDetails
 * @param function beforeStarting A function to be executed before the task starts
 * @param function duringPerforming A function to be executed during the execution of task
 * @param function afterEnds A function to be executed after the task is completed
 */
function Task(information, title, serverDetails, afterConfirmation, beforeStarting, duringPerforming, afterEnds){
	
	// we need for the lambda functions
	var instance = this;
	
	this.title        		= title;
	this.information 		= information;
	this.response			= null;
	this.serverDetails		= serverDetails;
	
	/*
	 * If there is exists an override of the method, call it after it calls the default
	 * If not call the default
	 */
	this.afterEnds         		= ((afterEnds)?function(){instance._afterEnds();instance.afterEnds(instance);}:this._afterEnds());
	this.beforeStarting    		= ((beforeStarting)?function(){instance._beforeStarting();instance.beforeStarting(instance);}:this._beforeStarting());
	this.duringPerforming  		= ((duringPerforming)?function(){instance._duringPerforming();instance.duringPerforming(instance);}:this._duringPerforming());
	this.afterConfirmation 		= ((afterConfirmation)?function(){instance._afterConfirmation();instance.afterConfirmation(instance);}:this._afterConfirmation());

	// starts
	this._activate();
}

/**
 * It is an internal function. Sends the confirmation to server, then it saves the confirmation details, it executes afterConfirmation and beforeStarting methods
 */
Task.prototype._activate = function(){
	
	game.removeCurrentAction();				// clear the actions board
	
	$.ajax({
			"url": this.serverDetails.url,
			"type": this.serverDetails.type,
			"data": this.serverDetails.data,
			"success": function(response){
							this.response = response;
							this.afterConfirmation();
							this.beforeStarting();
						},
			"error": function(){HTML_Engine.fail.content(this.title, " your people are not now able.");}
	});
};

/**
 * It is the default function for duringPerforming. It just shows the progress of the 
 */
Task.prototype._duringPerforming = function(){
	 game.currentProgressTasks[this].progressLabel.text( this.name + game.currentProgressTasks[this].progressbar( "value" ) + "%" );
}

/**
 * It is the default function for beforeStarting. It creates the progress bar for this task
 */
Task.prototype._beforeStarting = function(){
	game.createProgressBar(this);
};

/**
 * It is the default function for afterConfirmation. It checks if the server confirmed the task. Else, it stops it
 */
Task.prototype._afterConfirmation = function(){
	if(this.response.status === "error" ){
		HTML_Engine.failTask.content(this.title, this.response.message);
		this.afterEnds();
	}
};

/**
 * It is the default function for afterEnds. It removes the progress bar for the task, the task and updates the game
 */
Task.prototype._afterEnds = function(){
	game.removeTask(this);
	game.update();							// updates the game
};