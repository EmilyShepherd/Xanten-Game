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
 * It generates a table
 */
HTML_Engine.table = {
	content: function (data) {
		var html = "<table>";
		for(var i=0; i<=data.length-1; i++){
			console.log(data);
			column = data[i];
			html += "<tr>";
			for(var j=0; j<=column.length-1; j++){
				html += "<td class='bold' style='color:"+(j%2==0?"rgb(142, 142, 142)":"rgb(0, 71, 187)")+"'>"+data[i][j]+"</td>";
			}
			html += "</tr>";
		}
		html += "</table>"
		return html;
	}
};

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
			
			 //game.performAction("no_action");
			
			 // comment the above
			 
			 // uncomment the next
			 
			
			// Example of task
			// It is not working because the ProgressBar is not done
			// It is correct
			
			game.removeCurrentAction();
			
			var data			= $(this).serialize();
			var building_name 	= "mine";//game.city_map_buildings[data.building_id];
			
			
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
	
		var text = "<div class='tab'> ",
			things = [];
		
		var interval = resources.interval?("<span style='font-weight:italic;color:#969696'> for "+resources.interval)+"</span>":"";
		
		for(resource in resources.resources){
			things.push(HTML_Engine.getImage.content("img_resource", resource, resource) + " <span class='bold resource_format_" +resource+ "'>" + HTML_Engine.shortResourceRepresentation(resources.resources[resource])+" </span>" + interval);
		}
		
		if(resources.people){
			things.push(HTML_Engine.getImage.content("img_resource", 'people', 'people') + " <span class='bold resource_format_people"+ "'>" + HTML_Engine.shortResourceRepresentation(resources.people)+" </span>" + interval);
		}
		
		if(resources.time){
			things.push("Time: "+HTML_Engine.shortTimeRepresentation(resources.time));
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
		text = ((input/1000*100)/100).toFixed(2)+"k";
	} else 			
    if(len >= 7 && len <= 9) {
    	text =  ((input/1000000 * 100)/100).toFixed(2)+'m';
    } else     
    text = ((input/1000000000 * 100)/100).toFixed(2)+'b';
	
	return "<span title='"+ input.formatNumber(0) +"'>"+text+"</span>";
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


/*	Chooser */


/**
 * A chooser represents a set of mutiple input values from user using sliders
 */
HTML_Engine.chooser = {
	/**
	 * It generates the html of the chooser
	 * @param object args Information regarding the chooser. It must contain:
	 * The id of the chooser: chooser.id
	 * A description for the chooser: chooser.info
	 * The elements of the choose as an array, each object with an id and title: chooser.values
	 * The title of the button: chooser.button
	 * 
	 */
	content: function(args){
		var html = '';
		html = "<div class='heading'>" +
					"<div class='chooser' id='"+args.id+"_chooser' > " +
						"<div class='info'>" +(args.info?args.info:"")+ "</div>";						
						for (var i = 0; i < args.values.length; i++) {
							var value = args.values[i];
							html+= "<div class='element' id='element_"+value.id+"'>"+
									"<div class='bold'>"+value.title+":</div>"+
									"<div id='extra'></div>"+
									"<div><div id='slider' class='element_slider'></div></div>"+
									"<div>" +
									"<input type='number' size='3' value=''  id='input_value' />" +
									"</div>" +
								"</div>";
						}
						html +="<div class='center'>" +
								"<input type='button' value='"+args.button+"' id='"+args.id+"_button' /> " +
							"</div>" +
					"</div>" +
				"</div>";		
		return html;
	},
	/**
	 * It enables the chooser. It enables all the elements inside it
	 * @param Object args An object with the settings for all the elements inside a chooser:
	 * The id of the chooser: args.id
	 * The values of the elements as an array: args.values. Each element contain: id, min, max
	 * The action to be performed when the button is clicked: chooser.performAction
	 */
	enable: function(args){	

		$.each( args.values, function( index, value ){		
			
			var id		= args.id,
				value 	= args.values[index],
				div 	= $("#"+id+"_chooser #element_"+value.id),
				input	= div.find("#input_value"),
				slider	= div.find("#slider"),
				extra	= div.find("#extra"),
				action	= value.change?value.change:undefined,
				gen_act	= args.generalChange?args.generalChange:undefined,
				change 	= function( event, ui){
					input.val(ui.value);
					if(action){
						action(event, ui, extra);
					}
					if(gen_act){
						gen_act(event, ui, extra);
					}
				};

			slider.slider({
				min: value.min?value.min:0,
				max: value.max?value.max:0,
				animate: true,
				range: "min",
				value: value.min?value.min:0,
				slide: change,
				change: change,
				create: function( event, ui ) {ui.value = 1;change(event,ui);}
		    	});
		
			input.on("change keyup paste", function(){
				if($(this).val()!=='' && (parseInt($(this).val()) || $(this).val() === '0' ) ) {slider.slider( "value", parseInt($(this).val()) )} ;
			});


		});
		
		$("#"+args.id+"_button")
			.button()
			.click(args.performAction);		
	},
	/**
	 * It removes the functions from the memory and disables the listenerrs
	 * @param Object args An object with the id of the chooser. 
	 */
	disable: function(args){	
		
		var divs = $("#"+args.id+"_chooser div.element");
		
		for(i=0;i<divs.length;i++){
			div = divs[i];
			$(div).find("#slider").slider("destroy");
			$(div).find("#input_value").off();
		}
	},
	
	/**
	 * It returns the value for an elemenent inside a chooser
	 * @param string chooser The id of the chooser
	 * @param string element The id of the elemenent 
	 */
	fetch: function(chooser, element){
		return $("#"+chooser+"_chooser #element_"+element+" #input_value").val()
	},
	
	/**
	 * It returns the all the values of the elements inside a chooser
	 * @param string chooser The id of the chooser
	 */
	fetchAll: function(chooser){
		
		var all 	= $("#"+chooser+"_chooser").find(".element"),
			values 	= {};
		
		for(i=0;i<=all.length-1;i++){
			values[$(all[i]).attr("id")] = $(all[i]).find("#input_value").val();
		}
		return values;		
	}
};

/*	Buildings */

/**
 * The military
 */
HTML_Engine.insideMilitary = {
		
	/**
	 * It generates the content for the military building
	 */
	content: function(){
		var html = "";
		var nr_of_active_units = 55; // TODO @Cristian The real number
		
		html += "<div class='heading'> The number of active units:";
		html += HTML_Engine.displayResources.content({
			resources: {
				"military" : nr_of_active_units 				
			},
		}) + "</div>";
		html += "<div class='heading'> The daily cost of military is: " + 
								HTML_Engine.displayResources.content({
										resources: {
										"gold" : nr_of_active_units * 5, /* TODO @George real resources */
										"food" : nr_of_active_units * 1 /* TODO @George real resources */
									}
								}) + "</div>";
		html += HTML_Engine.chooser.content({
			info: "The military plays an important role for your city. You can increase your military power and became a local or imperial power. The first step is to train free people in order to became military units. ",
			values: [
						{
							title: "Train new military units",
							id: "units"
						}
					],
			button: "Train !",
			id: "military_train"
		});	
		if(nr_of_active_units !== 0){
			html += HTML_Engine.chooser.content({
				info: "You can reduce the cost of military by reducing the number of military people. Unfortuntly this does not give back the resources.",
				values: [
							{
								title: "Reduce military units",
								id: "units"
							}
						],
				button: "Reduce units!",
				id: "military_untrain"
			});	
		}
		
		
	
		
		return html;
	},
	/**
	 * It enables the functionality for the military building
	 */
	enable: function(){

		var nr_of_active_units = 55;
		
		/**
		 * It creates the chooser to let the user to choose how many utits to create
		 */
		HTML_Engine.chooser.enable({
			
			id: "military_train",
			values: [
						{ id: 'units',
							min: 1,
							max: 700, /* TODO @Cristian the number of free people*/
							change: function(event, ui, extra){
										extra.html(HTML_Engine.displayResources.content({
											resources: {
												"wood" : parseInt(ui.value)*20, /* TODO @George real resources */
												"food" : parseInt(ui.value)*5 /* TODO @George real resources */
											},
											time: parseInt(ui.value)*10 /* TODO @George real resources */
										}));
									}
						}								
					],
			performAction: function(){
										game.performTask("move_people", {
											from: "free",
											to: "military",
											number: HTML_Engine.chooser.fetch("military_train", "units")
										} );
									}
		});
		

		if(nr_of_active_units !== 0){
			/**
			 * It creates the chooser to let the user to choose how many utits to create
			 */
			HTML_Engine.chooser.enable({
				
				id: "military_untrain",
				values: [
							{ id: 'units',
								min: 1,
								max: nr_of_active_units, /* TODO @Cristian the number of free people*/
								change: function(event, ui, extra){
											extra.html(HTML_Engine.displayResources.content({
												time: parseInt(ui.value)*5 /* TODO @George real resources */
											}));
										}
							}								
						],
				performAction: function(){
											game.performTask("move_people", {
												from: "military",
												to: "free",
												number: HTML_Engine.chooser.fetch("military_untrain", "units")
											} );
										}
			});
		}
	},
	/**
	 * It calls the disable methods of the military choosers
	 */
	disable: function(){	
		HTML_Engine.chooser.disable({
			id: "military_train"
		});		
		HTML_Engine.chooser.disable({
			id: "military_untrain"
		});
	}
};
	
/* ------------------------------ World Map  ------------------ */



HTML_Engine.selectCity = {
	content: function(args){		
		var city = game.worldMap.getCityById(args);
		var html = "";
		html += HTML_Engine.table.content(
			[
			 	["Name of city:", city.name ],
			 	["Player:", city.player],
			 	["Level:", city.level]
			 ]
		);				
		
		html += "<br /><br />" +
				"<div class='heading'><span class='bold'> Actions for this city: </span><br />" +
				"<div class='heading'>Your imperial forces can bring new resources. <br /><input class='action_bt' id='start_attack' value='Perform an attack' /></div>" +
				"<div class='heading'>Do you have something important to tell to this king ? <br /><input class='action_bt' id='send_message' value='Send message' /></div>" +
				"<div class='heading'>Do you want to have a fair trade with this city ?<br /><input class='action_bt' id='trade_resources' value='Trade resources' /></div>" +
				"" +
				"</div>";
		
		return html;
		
	},
	enable: function(id_selected_city){		
		$(".action_bt").button();
		$("#start_attack").click(function(){
			game.performAction("attackCity", id_selected_city);
		});
		$("#send_message").click(function(){
			game.performAction("sendMessage", id_selected_city);
		});
		$("#trade_resources").click(function(){
			game.performAction("tradeResources", id_selected_city);
		});
	},
	disable: function(){	
		$(".action_bt, #start_attack, #send_message, #trade_resources").off();
	}
};


/**
 * Attack a city
 */
HTML_Engine.attackCity = {
		
	/**
	 * It generates the content for the military building
	 */
	content: function(args){
		var nr_of_active_units = 55; // TODO @Cristian The real number
		var html = "<div class='heading'>Target: <span class='bold' style='color:red'>" + game.worldMap.getCityById(args).name + "</div>";

		html += "<div class='heading'> The number of active units:";
		html += HTML_Engine.displayResources.content({
			resources: {
				"military" : nr_of_active_units 				
			},
		}) + "</div>";
		
		if(nr_of_active_units !== 0 && game.player.buildings.military.level !== 0){
			html += HTML_Engine.chooser.content({
				info: "Decide very wize how many units you want to send",
				values: [
							{
								title: "Military units",
								id: "units"
							},
							{
								title: "Wine to increse happiness",
								id: "wine"
							}
						],
				button: "Start attack !",
				id: "military_attack"
			});	
		}
				
		return html;
	},
	/**
	 * It enables the functionality for the attack
	 */
	enable: function(args){

		var nr_of_active_units = 55;

		if(nr_of_active_units !== 0 && game.player.buildings.military.level !== 0){
			/**
			 * It creates the chooser to let the user to choose how many utits to send into attack
			 */
			HTML_Engine.chooser.enable({
				
				id: "military_attack",
				values: [
							{ id: 'units',
								min: 1,
								max: nr_of_active_units, /* TODO @Cristian the number of free people*/
								change: function(event, ui, extra){
											extra.html(HTML_Engine.displayResources.content({
												resources : {
													gold: parseInt(ui.value)*500, /* TODO @George real resources */
													food: parseInt(ui.value)*200
												},
												interval: "one minute"
											}));
										}
							},
							{
								id: 'wine',
								mine: 1,
								max: 900, /* TODO @Cristian */
								change: function(event, ui, extra){
									extra.html("Incresed by " + Math.round(parseInt(ui.value)/900*25) + "%");
								}
								
							}
						],
				performAction: function(){
											game.performTask("attack_city_1", {
												target: args,
												number: HTML_Engine.chooser.fetchAll("military_attack")
											} );
										}
			});
		} else {
			return "You have no active units or military.";
		}
	},
	/**
	 * It calls the disable methods of the military choosers
	 */
	disable: function(){	
		HTML_Engine.chooser.disable({
			id: "military_attack"
		});	
	}
};


/**
 * Send a message
 */
// TODO @Joe
HTML_Engine.sendMessage = {
		
	/**
	 * It generates the content for the message
	 */
	content: function(args){
		// TODO @George
		var html = "Its HTML_Engine content should be implemented";				
		return html;
	},
	/**
	 * It enables the functionality for the message
	 */
	enable: function(args){

	},
	disable: function(){
	}
};


/**
 * Trade 
 */
// TODO @Cristian
HTML_Engine.trade = {
		
	/**
	 * It generates the content for the trade
	 */
	content: function(args){
		// TODO @George
		var html = "Its HTML_Engine content should be implemented";				
		return html;
	},
	/**
	 * It enables the functionality for the trade
	 */
	enable: function(args){

	},
	disable: function(){
	}
};

	