/**
 * Represents performing task. It is a view object (MCV)
 *
 * @author Cristian Sima and George Salter
 * @version 30.11.2014
 */

// CAN BE COMPLETED ONCE SERVER GIVES RESPONSE


/**
 * Represents performing task. It is a view object (MCV). It shows the progress of task in real time in the current task box
 * 
 * @param Task task The task object
 */
function ProgressBar(task){
	
	this.task = task;
	
	game.currentTasksBoard.add("<div id='task_"+this.task.id+"'><img width='25px' height='25px' src='"+task.imgSource+"'>   "+task.title+"<div id='progressbar_"+this.task.id+"'><div class='progress-label'></div></div></div>");
	
	this.p			 		= $( "#progressbar_"+this.task.id );
    this.progressLabel 		= $( "#progressbar_"+this.task.id ).find( ".progress-label" );
    
    var instance			= this,
	    seconds 			= 2,
	 	step 				= seconds * 10,
	 	progress			= (function(){ var i = instance; 
								 	return function(){
							    		val = i.p.progressbar( "value" ) || 0;
							    		i.p.progressbar( "value", val + 1 );	
							    	}; })(instance);
 
    this.p.progressbar({
		value: false,
		change: function() {
    		instance.progressLabel.text( instance.p.progressbar( "value" ) + "%" );
		},
		complete: function() {
			instance.progressLabel.text( "Complete!" );
			instance.finish();
		}
    });	

	this.thread = setInterval(progress, step);
	
}

/**
 *  It finished the task. It stops the progress, calls the task.afterEnds() method and deletes itself from the game
 */
ProgressBar.prototype.finish = function() {	
	this.task.afterEnds();
};


