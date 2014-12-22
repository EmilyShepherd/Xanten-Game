/**
 * Represents performing task. It is a view object (MCV)
 *
 * @author Cristian Sima and ...
 * @version 30.11.2014
 */



// TODO !!! This object is not ready. It does not work because you have to complete it
// CAN BE COMPLETED ONCE SERVER GIVES RESPONSE




/**
 * Represents performing task. It is a view object (MCV). It shows the progress of task in real time in the current task box
 * 
 * @param Task task The task object
 */
function ProgressBar(task){
	
	this.task = task;
	this.id   = 1//task.response.id;
	
	this.value = 0;
	
	// TODO something like this. search on google progress bar jquery or find something nice
	game.currentTasksBoard.add("<div class='progress_bar' id='progress_bar_"+this.task.id+"'><div id='label'>"+task.title+"</div></div>");
	this.HTML_element = $("#progress_bar_"+this.task.id);	
	
	this.HTML_element.progressbar({
			value: false,
	      change: task.progress,
	      complete: task.afterEnds
	    });	
	

	this.HTML_element.html();
	
	
	// this.thread = setInterval(this.prototype, 100);
}

/**
 *  It finished the task. It stops the progress, calls the task.afterEnds() method and deletes itself from the game
 */
ProgressBar.prototype.finish = function() {
	
	clearInterval(this.thread);
	
	task.afterEnds();
	
	
	// TODO delete html
	
	
	// delete itself from game logics	
	delete game.currentProgressTasks[this];
};

/**
 * It is executed every time a new progress is done. it calls the task durring performing
 */
ProgressBar.prototype.progress =   function () {
	
	// check it has the hights progress. if so it goes first in the list
	
   	task.duringPerforming();
	
   	// increate the value
   	
	if(this.value  >= 100){
		this.finish();
	}
}