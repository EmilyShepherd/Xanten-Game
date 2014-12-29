/**
 * @file Represents a progress bar
 * @author Cristian Sima and George Salter
 * @version 30.12.2014
 */

/**
 * Represents performing task. It is a view object (MCV). It shows the progress of task in real time in the current task box
 * @construct
 * @property {Task} task The reference of the task object
 * @property {object} p The progress object
 * @param Task task The task object
 */
function ProgressBar(task){
	
	this.task = task;
	
	Window.currentTasksBoard.add("<div id='task_"+this.task.id+"'><img width='25px' height='25px' src='"+task.imgSource+"' align='absmiddle' >   "+task.title+"<div id='progressbar_"+this.task.id+"'><div class='progress-label'></div></div></div>");
	
	this.p			 		= $( "#progressbar_"+this.task.id );
    this.progressLabel 		= $( "#progressbar_"+this.task.id ).find( ".progress-label" );
    
    var instance			= this,
	    seconds 			= Math.random() * (7 - 1) + 1;
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
	
}

/**
 *  It finished the task. It stops the progress, calls the task.afterEnds() method and deletes itself from the game
 *  @memberOf ProgressBar.prototype
 */
ProgressBar.prototype.finish = function() {	
	this.task.afterEnds();
};

/**
 * It starts the thread
 * @memberOf ProgressBar.prototype
 */
ProgressBar.prototype.start = function(){
	this.thread = setInterval(progress, step);
}