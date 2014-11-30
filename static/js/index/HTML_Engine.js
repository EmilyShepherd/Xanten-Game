/**
 * The HTML_Engine object
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */

/**
 * The HTML_Engine generates the HTML for the game. represents the View object (MCV). It  It generates the code, it adds the necessary listeners. Then it can disable the listeners
 */
function HTML_Engine(){
	// nothing
};

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
		return "" + text;
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
 * It displays the resources in HTML format
 */
HTML_Engine.displayResources = {
	/**
	 * It displays the resources
	 */
	content: function(resources){
		var text = "It needs: <div class='tab'> ";
		
		for(resource in resources){
			text +=  resources[resource]+" <span class='bold'>" + resource + "</span><br />";
		}
		text += "</div>";
		
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