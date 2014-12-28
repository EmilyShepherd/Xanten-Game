/**
 * The tasks of the game
 * @see Task
 * @memberOf Game.prototype
 */
game.tasks = {
		/**
		 * It represents the task for moving military units from city (attack or movement)
		 * @param {object} data It contains: from, to, number
		 *  
		 */
		"move_military_units": function(data) {	
			return new Task(data,
				'Move <span class="bold">' + data.options.element_units + '</span> military units<br />'+"<span class='bold'>" +  HTML_Engine.worldPath.getCityName(data.from) + "</span> --> <span class='bold'>" + HTML_Engine.worldPath.getCityName(data.to) + "</span>", {
					// TODO change url 
					"url": '/me/building/' + data["building"] + '/build',
					"data": data,
					"type": 'GET'
				},
				function(task) {
					if(task.data.to !== game.player.id) {
						// Your_city ---> Other
						var resources = game.unit.military.attack(task.data.options.element_units);
						game.player.city.buildings.military.people -= task.data.options.element_units;
						game.player.consumeResources(resources);
						game.cityMap.update();
					} else {
						// Other ---> Your_city 
						//nothing
					}
				},
				undefined,
				undefined,
				function(task) {
					if(task.data.to === game.player.id){
						// It reached your city. Finished the attack
						
						// TODO remove this
						// an example of possible response
						task.response = {
							carring : {
								resources: {
									"food": 200,
									"wood": 4000,
									"gold": 2000,
									"military": 10
								}
							}
							
						};
						task.response.carring = new Resources(task.response.carring);
						game.player.giveResources(task.response.carring);
					} else {
						
						// It reached the destination. Now it comes back to city
						var data 		= task.data,
							temp		= task.data.from;
						
						data.response 	= task.response;
						data.from		= task.data.to;
						data.to			= temp;
						
						game.performTask("move_military_units", data);						
					}					
				},
				"static/img/game/resource/military.png");
		},
		"update_building": function(data) {	
			return new Task(data,
				'Level up <span class="bold">' + data["building"] + "</span> to " + data.toLevel , {
					// TODO change url 
					"url": '/me/building/' + data["building"] + '/build',
					"data": data,
					"type": 'GET'
				},
				function(task) {
					var resources = game.constructions.buildings[task.data["building"]].levelUp(data.toLevel);
					task.data.peopleBack = resources.people;
					game.player.city.buildings[task.data.building].status = 'upgrading';
					game.player.consumeResources(resources);
					game.cityMap.update();					
				},
				undefined,
				undefined,
				function(task) {
					game.player.city.buildings[task.data.building].level++;
					game.player.city.buildings[task.data.building].status = 'Done';
					game.player.city.buildings.administration.people = parseInt(game.player.city.buildings.administration.people) + parseInt(task.data.peopleBack);
				},
				"/static/img/game/buildings/" + data.building + ".png");
		},
		"train_military": function(data) {
			return new Task(data,
				'Training <span class="bold">' + data.number + "</span> military units" , {
					// TODO url should be changed to /me/people/move
					// TODO type changed to PUT
					"url": '/me/building/military/build',
					"data": data,
					"type": 'GET'
				},
				function(task) {					
					game.player.consumeResources(game.unit.military.attack(task.data.number));
				},
				undefined,
				undefined,
				function(task) {
					game.player.city.buildings.military.people 	= parseInt(task.data.number) + parseInt(game.player.city.buildings.military.people);
				},
				"static/img/game/resource/military.png");
		},
		"untrain_military": function(data) {
			return new Task(data,
				'Reduce <span class="bold">' + data.number + "</span> military units" , {
					// TODO url should be changed to /me/people/move
					// TODO type changed to PUT
					"url": '/me/building/military/build',
					"data": data,
					"type": 'GET'
				},
				undefined,
				undefined,
				undefined,
				function(task) {
					game.player.city.buildings.military.people 	= parseInt(game.player.city.buildings.military.people) - parseInt(task.data.number);
				},
				"static/img/game/resource/military.png");
		},
		"create_building": function(args) {
			var data = {};
			data["cell"] 		= game.cityMap.getSelectedCell();
			data["building"] 	= $(args).attr("building_name");
	
			return new Task(data,
				'Create building ' + data["building"], {
					"url": '/me/building/' + data["building"] + '/build',
					"type": 'GET'
				},
				function(task) {
					// create building
					if (task.data.building !== "house") {
						game.player.city.buildings[task.data.building].level = 1;
					}
					var resources = game.constructions.buildings[task.data["building"]].levelUp(1);
					task.data.peopleBack = resources.people;
					game.player.city.buildings[task.data.building].status = 'under_construction';
					game.cityMap.array[data.cell.x-1][data.cell.y-1].type_construction = "building";
					game.cityMap.array[data.cell.x-1][data.cell.y-1].id_construction = game.constructions.buildings[task.data.building].id;
					game.cityMap.update(); // change the status of the city map
					game.player.consumeResources(resources);
				},
				undefined,
				undefined,
				function(task) {
					game.player.city.buildings[task.data.building].num++;
					game.player.city.buildings[task.data.building].status = 'Done';
					game.player.city.buildings.administration.people = parseInt(game.player.city.buildings.administration.people) + task.data.peopleBack;
				},
				"/static/img/game/buildings/"+data.building+".png");
	}
};