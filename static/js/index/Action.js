/**
 * An action object is a model (MCV) object which performs an action of the user. 
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */
 

/**
 *  An action object is a model (MCV) object which performs an action of the user.
 *  @param HTML_Engine_Reference A reference to the HTML_ENGINE object.
 *  @param beforeRemove A function to be called before the Action is done (or removed by the game)
 *  @param serverCall If the action needs to get remote information and to execute a function after receiving the inforamation, this value should be an object for the AJAX request. The object MUST contain "type", "url", "data". You can specify a callback function using the parameter "cb" 
 * 	@example new Action(HTML_Engine.worldMapSelected, undefined, {
 *																	"url":"/game/map/world", 
 *																	"type": "GET"
 *																	"cb":function(information){game.worldMap.update(inforamtion); game.worldMap.render();}
 *																}),
 *  
 */
function Action(HTML_Engine_Reference, beforeRemove, serverCall){	
	this.HTML_Engine_Reference = HTML_Engine_Reference;
	this.beforeRemove          = beforeRemove;
	this.args                  = undefined;
	this.serverCall            = serverCall?serverCall:undefined;
	this.ajaxCall			   = undefined;
}

/**
 * It calls the perform method of the action and refreshes the content of the action.
 */
Action.prototype.update = function(){
	this.perform();
}

/**
 * If the action needs an AJAX request it does it. Then it calls the call back and updates the HTML. If it does not need an AJAX request, it just updates the HTML
 */
Action.prototype.perform = function(){

	var instance   = this;
	if(this.serverCall){
		HTML_Engine.loadAction.content()
		this.ajaxCall = $.ajax({"url": this.serverCall.url,
				"type": this.serverCall.type,
				"data": this.serverCall.data,
				"success": function(response){instance.serverCall.cb(response);instance.updateHTML();},
				"error": function(){HTML_Engine.failAction.content(); HTML_Engine.failAction.enable();}
		});
	} else {
		this.updateHTML();	
	}
};

/**
 * It updates the HTML for the action by calling the content function of the HTML_Engine object. Then it activates the content.
 */
Action.prototype.updateHTML = function(){
	$("#actions_board .inside").html("");
	$("#actions_board .inside").hide();
	$("#actions_board .inside").html(this.HTML_Engine_Reference.content?this.HTML_Engine_Reference.content(this.args):"");
	$("#actions_board .inside").fadeIn('slow');
	
	if(this.HTML_Engine_Reference.enable){
		this.HTML_Engine_Reference.enable();
	}
};

/**
 * If there was any AJAX request it aborts it. If the action has code to be executed before the function is done, it executes it. Then, it disables the HTML listeners by calling the 'disable' function of the HTML_Engine object
 */
Action.prototype.remove = function(){
	if(this.ajaxCall){
		this.ajaxCall.abort();
	}
	
	if(this.beforeRemove){
		this.beforeRemove();
	}
	
	if(this.HTML_Engine_Reference.disable){
		this.HTML_Engine_Reference.disable();
	}
};