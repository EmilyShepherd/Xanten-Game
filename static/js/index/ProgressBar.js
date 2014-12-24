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
	this.id   = Math.floor((Math.random() * 10) + 1);//task.response.id;
	
	game.currentTasksBoard.add("<img width='25px' height='25px' src='"+task.imgSource+"'>   "+task.title+"<div id='progressbar_"+this.id+"'><div class='progress-label'></div></div>");
	
	var progressbar = $( "#progressbar_"+this.id ),
      progressLabel = $( "#progressbar_"+this.id ).find( ".progress-label" );
 
    progressbar.progressbar({
		value: false,
		change: function() {
			progressLabel.text( progressbar.progressbar( "value" ) + "%" );
		},
		complete: function() {
			progressLabel.text( "Complete!" );
		}
    });

	var seconds = 20;
	var step = seconds * 10;
	
	var progress = function() {
		var val = progressbar.progressbar( "value" ) || 0;
 
		progressbar.progressbar( "value", val + 1 );
 
		if ( val < 99 ) {
			setTimeout(progress, step);
		}
    };
	
	progress();
	
	/*this.HTML_element = $("#progress_bar_"+this.task.id);	
	
	this.HTML_element.progressbar({
			value: false,
			change: task.progress,
			complete: task.afterEnds
	    });	
	

	this.HTML_element.html();*/
	
	
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
	
	// TODO check it has the hights progress. if so it goes first in the list
	
   //	task.duringPerforming();
   	
	if(val  >= 100){
		this.finish();
	}
}