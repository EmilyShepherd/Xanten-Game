/**
 * The HTML_Engine object
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */

/**
 * The HTML_Engine generates the HTML for the game. represents the View object (MCV). It  It generates the code, it adds the necessary listeners. Then it can disable the listeners
 */
var  HTML_Engine = {
	path: {
				img_city_bulding:		'/static/img/game/city/building/',
				img_city_element:		'/static/img/game/city/element/',
				img_city_background:	'/static/img/game/city/building/',
				img_world_background:	'/static/img/game/world/building/',
				img_resource:			'/static/img/game/resource/'
		}
}


/* // Example:
	HTML_Engine. = {
		content: function(args){		
		},
		enable: function(args){			
		},
		disable: function(args){			
		}
	};
*/


/**
 * It returns a image from the game
 */
HTML_Engine.getImage = {
	
		/**
		 * It constructs an image. For example: HTML_Engine.content.getImage('img_resource', 'gold', 'Gold') returns ===> <img title="Gold" src="/static/img/game/resource/gold.png" align="absmiddle">
		 * @param string path A HTML_Engine.path string
		 * @param string image The name of the image (for example: gold or mine
		 * @param string title It is optional. It sets the title for the image
		 */
	content:function(path, image, title){	
			return "<img "+(title?("title='" + image.capitalize()+"'"):"")+" src='" + HTML_Engine.path[path] + image + ".png' align='absmiddle' />";
	}
}

/**
 * Returns the list of all the building which can be created and the resources for them
 */
HTML_Engine.getAvailableBuildings = {
		
	/**
	 * It generates the content
	 */
	content: function(){
	
		// TODO to display the resources for the building
		// TODO to display the image of the building
		
	
		var text = "Buildings available to build there: <br />";
		
		for(building in game.player.buildings){

			var resources = game.resources.getNecessaryForBuilding(building, 'create');
			
			text += "<div class='board_list hover' id='action_build_" + building + "' >" +
					"<input type='hidden' name='building_id' ='" + building.id + "' />" +
					"<img align='absmiddle' width='60px' height='60px' src='http://clipart.nicubunu.ro/png/rpg_map/tavern.svg.png"+/*building.img*/""+"' /> <span class='bold'>" + building.capitalize() + "</span>  <br />";
			
			text += HTML_Engine.displayResources.content(resources);
				
			text += "</div><br />";
		}
		return text;
	},
	
	/**
	 * It add a listener for each building
	 */
	enable: function(){
		$("#actions_board .board_list").click(function(){
			
			 game.performAction("no_action");
			
			 // comment the above
			 
			 // uncomment the next
			 
			/*
			// Example of task
			// It is not working because the ProgressBar is not done
			// It is correct
			
			game.removeCurrentAction();
			
			var data			= $(this).serialize();
			var building_name 	= game.city_map_buildings[data.building_id];
			
			
			new Task(data, 
					'Create building <span class="bold">' + building_name + '</span>',
					{
						"url": '/me/building/' + building_name  + '/build',
						"type": 'GET'						
					},
					function(task){
						// create building
						game.player.buildings.id = task.response.building;
						game.player.buildings.bulding_id.status = 'Building';
						game.cityMap.render(); // change the status of the city map
						game.consumeResources(game.resources.getNecessaryForBuilding(data.building_id, 'create'));
					}, 
					undefined, 
					undefined, 
					function(task){
						game.player.buildings.bulding_id.num++;
						game.player.buildings.bulding_id.level = 1;
						game.player.buildings.bulding_id.status = 'Done';
					});
			*/
			})
	},
	
	/**
	 * It removes all the listeners
	 */
	disable: function(){
		$("#actions_board .board_list").off();
	}
};

/**
 * It displays the resources (gold, wood, stone, food, people and the time)  in HTML format
 */
HTML_Engine.displayResources = {
	/**
	 * It displays the resources
	 * @param object The resources specified by Resources.getNecessaryForBuilding
	 * @see Resources.getNecessaryForBuilding
	 */
	content: function(resources){
	
		var text = "It requires: <div class='tab'> ",
			things = [];
		
		for(resource in resources.resources){
			things.push(HTML_Engine.getImage.content("img_resource", resource, resource) + " <span class='bold resource_format_" +resource+ "'>" + HTML_Engine.shortResourceRepresentation(resources.resources[resource])+" </span>");
		}
		
		if(resources.time){
			things.push("Time: "+HTML_Engine.shortTimeRepresentation(resources.time));
		}
		
		if(resources.people){
			things.push("Number of people: <span class='bold'>"+HTML_Engine.shortResourceRepresentation(resources.people) + "</span>");
		}
		
		text += things.join("<br />") + "</div>";
		
		return text;
	}
}

/**
 * It returns the string for no action for a string
 */
HTML_Engine.noAction = {
		/**
		 * It returns the string
		 */
		content: function(){
			return "No action for now"
		}
}

/**
 * It returns the HTML code when the city map was chosen
 */
HTML_Engine.cityMapSelected = {
		/**
		 * It returns the string
		 */
		content: function(){
			return "<br /><img src='http://clipart.nicubunu.ro/svg/rpg_map/statue.svg' /><div><span class='bold'>Aloha there, </span><br />Here is your glorious city, with brave and nice people who have a wonderfull life. Be carefull to mantain in this state...</div>";
		}
}

/**
 * It returns the HTML code when the world map was chosen
 */
HTML_Engine.worldMapSelected = {
		/**
		 * It returns the string
		 */
		content: function(){
			return "<img align='middle' src='http://clipart.nicubunu.ro/png/events/graduation03.svg.png' /> <div>Hmmm... It seems you can see the world map. It contains the other cities. Click on a city to see the options.</div>";
		}
}

//It is an example of a dynamic action with arguments
/**
 * It displays a message
 */
HTML_Engine.seeMessage = {
		/**
		 * It displays the content of the message
		 * @param args The object which contain information regarding the message ('id' and 'content')
		 */
		content: function(args){
			return "This is the message nr <b>"+args.id+"<b>:<br/ ><i>"+args.content+'</i>. ';
		}
}

/**
 * It returns the HTML code when a building is selected
 */
HTML_Engine.insideBuilding = {
		content: function(args){
			return "That building is now selected and you are inside. There is no action here.";
		}
}

/**
 * It returns the string when an action which needs information from server fail. It allows the user to perform again it 
 */
HTML_Engine.failAction = {
	/**
	 * It returns the string
	 */
	content: function(){
		$("#actions_board .inside").html("Sir, there was a problem for your people to get that information... Try to find better ones and then tell them <span class='link' id='action-try-again'>to try again</span>");

	},
	/**
	 * It adds a listener for the button 'try again'.
	 */
	enable: function(){
		$("#action-try-again").click(function(){
			game.currentAction.perform();
		});
	}
};

/**
 * It displays the string which is seen while an action is performing an AJAX request
 */
HTML_Engine.loadAction = {
	/**
	 * It generates the string
	 */
	content: function(){
		$("#actions_board .inside").html("<div class='center'><img src='static/img/game/loading.gif' width='32px' height='32px'/></div> Sir, please wait to check this...");
	}	
};

/**
 * It shows the 
 */
HTML_Engine.failTask = {
	/**
	 * It generates the content
	 * @param task_title The title of the task
	 * @param reason  The reason of the task
	 */	
	content: function(task_title, reason){
		game.newsBoard.add(task_title + " was no possible because " + reason);	
	}
};


/**
 * It returns a short representation of the resource. 
 * 
 * <1000 => the value
 * 1k
 * 1m
 * 1b
 * 
 * @param Number input The amount of resource
 * @returns string The amount in a short representation
 */
HTML_Engine.shortResourceRepresentation = function (input){
	
	var len  = input.toString().length,
		text = "";
	
	if(len <= 3){
		text = input;
	} else 	
	if(len >= 4 && len <= 6) {
		text = (Math.round(input/1000*100)/100).toString()+"k";
	} else 			
    if(len >= 7 && len <= 9) {
    	text =  (Math.round(input/1000000 * 100)/100).toString()+'m';
    } else     
    text = (Math.round(input/1000000000 * 100)/100).toString()+'b';
	
	return "<span title='"+ input +"'>"+text+"</span>";
}


/**
 * It returns a short representation of time in this format: {hours} h, {minutes} h, {seconds} sec OR "Instant" (if time is 0)
 * 
 * 
 * @param Number sec_num The time expressed in number of seconds
 * @return string The time in this format: {hours} h, {minutes} h, {seconds} sec OR "Instant" (if time is 0)
 */
HTML_Engine.shortTimeRepresentation = function (sec_num){
	
	sec_num = parseInt(sec_num);
	
	if(sec_num === 0){
		return "<span class='bold'>Instant</span>";
	}

	var	elements = [],
	 	hours   = Math.floor(sec_num / 3600),
	 	minutes = Math.floor((sec_num - (hours * 3600)) / 60),
	 	seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours   !== 0) {elements.push("<span class='bold'>" + hours   + " h</span>");}
	if (minutes !== 0) {elements.push("<span class='bold'>" + minutes + " min</span>");}
	if (seconds !== 0) {elements.push("<span class='bold'>" + seconds + " sec</span>");}
	
	return elements.join(", ");		
}