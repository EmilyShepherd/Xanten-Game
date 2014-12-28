/**
 * @file Represents an action object
 * @author Cristian Sima
 * @version 30.12.2014
 */
 

/**
 *  An action object is a model (MCV) object which performs an action of the user.
 *  @constructor
 *  @param {HTML_Engine} HTML_Engine_Reference The function which generates the content (usually a HTML_Engine object) 
 *  @param {function} beforeRemove A function to be called before the Action is done (or removed by the game)
 *  @param {function} serverCall If the action needs to get remote information and to execute a function after receiving the inforamation, this value should be an object for the AJAX request. The object MUST contain "type", "url", "data". You can specify a callback function using the parameter "cb" 
 * 	@example 
 * 		new Action("Actions city", HTML_Engine.selectCity, function() {
 *			game.worldMap.deselect();
 *		});
 */
function Action(name, HTML_Engine_Reference, beforeRemove, serverCall){	
	this.name				   = name;
	this.instance			   = this;
	this.HTML_Engine_Reference = HTML_Engine_Reference;
	this.beforeRemove          = beforeRemove;
	this.args                  = undefined;
	this.serverCall            = serverCall?serverCall:undefined;
	this.ajaxCall			   = undefined;
}

/**
 * It sets the arguments for the action
 * @param {object} args The arguments for the action
 */
Action.prototype.setArguments = function(args){
	this.args = args;
};

/**
 * It calls the perform method of the action and refreshes the content of the action. It does fadeOUT - fadeIn
 * @memberOf Action.prototype
 */
Action.prototype.update = function(){
	console.log("show")
	this.perform(false);
}


/**
 * If the action needs an AJAX request it does it. Then it calls the call back and updates the HTML. If it does not need an AJAX request, it just updates the HTML
 * @param {boolean} fade If set to true, the action will be shown by a fade effect
 * @memberOf Action.prototype
 */
Action.prototype.perform = function(fade){
	var instance = this;
	$("#action_window div.before_window").html(this.name);
	var instance   = this;
	if(this.serverCall){
		HTML_Engine.loadAction.content()
		this.ajaxCall = $.ajax({"url": this.serverCall.url,
				"type": this.serverCall.type,
				"data": this.serverCall.data,
				"success": function(response){instance.serverCall.cb(response);instance.updateHTML(true);},
				"error": function(){HTML_Engine.failAction.content(); HTML_Engine.failAction.enable();}
		});
	} else {
		this.updateHTML(fade);	
	}
};

/**
 * It updates the HTML for the action by calling the content function of the HTML_Engine object. Then it activates the content.
 * @param {boolean} fade If set to true, the action will be shown by a fade effect
 * @private 
 * @memberOf Action.prototype
 */
Action.prototype.updateHTML = function(fade){
	if(fade) {
		$("#actions_board .inside").html("");
		$("#actions_board .inside").hide();
	}
	$("#actions_board .inside").html(this.HTML_Engine_Reference.content?this.HTML_Engine_Reference.content(this.args):"");
	if(fade) {
		$("#actions_board .inside").fadeIn('slow');
	}
	
	if(this.HTML_Engine_Reference.enable){
		this.HTML_Engine_Reference.enable(this.args);
	}
};

/**
 * If there was any AJAX request it aborts it. If the action has code to be executed before the function is done, it executes it. Then, it disables the HTML listeners by calling the 'disable' function of the HTML_Engine object
 * @memberOf Action.prototype
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