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

	// move units to or from a enemy city
	"move_military_units": function(data) {
		return new Task(data,
			'Move <span class="bold">' + data.options.element_units + '</span> military units<br />' + "<span class='bold'>" + HTML_Engine.worldPath.getCityName(data.from) + "</span> --> <span class='bold'>" + HTML_Engine.worldPath.getCityName(data.to) + "</span>", {
				"url": '/military/attack/' + data.to + '/' + data.options.element_units,
				"type": 'GET'
			},
			function(task) {
				if (task.data.to !== game.player.id) {
					// Attack - Stage 1
					//
					// Your_city ---> Other
					var resources = game.unit.military.attack(task.data.options.element_units);
					game.player.city.buildings.military.people -= task.data.options.element_units;
					game.player.consumeResources(resources);
					game.update();

				} else {
					// Attack - Stage 3
					//
					// Other ---> Your_city 
					task.response = {
						friends: {
							resources: {
								"military": 45,
								"food": 20001
							}
						},
						enemies: {
							resources: {
								"military": 40,
								"food": 200
							}
						},
						status: "won",
						carring: {
							resources: {
								"food": 200,
								"wood": 4000,
								"gold": 2000,
								"military": 10
							}
						}
					};

					if (task.response.status === 'won' && task.response.carring.resources.military) {
						task.data.options.element_units = task.response.carring.resources.military;
						task.title = 'Returning <span class="bold">' + data.options.element_units + '</span> military units<br />' + "<span class='bold'>" + HTML_Engine.worldPath.getCityName(data.from) + "</span> --> <span class='bold'>" + HTML_Engine.worldPath.getCityName(data.to) + "</span>";
						// report
						Window.newsBoard.add(
							HTML_Engine.attackCity.report(task.data, task.response)
						);
					} else {
						// report
						Window.newsBoard.add(
							HTML_Engine.attackCity.report(task.data, task.response)
						);
						task.forceStop();
					}
				}
			},
			function(task) {
				if (task.data.to === game.player.id) {
					// Attack - Stage 2
					//					
					// It reached your city. Finished the attack

					task.response.carring = new Resources(task.response.carring);
					game.player.giveResources(task.response.carring);



				} else {
					// Attack - Stage 4
					//
					// It reached the destination. Now it comes back to city
					var data = task.data,
						temp = task.data.from;

					data.response = task.response;
					data.from = task.data.to;
					data.to = temp;

					game.performTask("move_military_units", data);

				}
			},
			"static/img/game/resource/military.png");
	},
	// move units to or from a friend city
	"trade": function(data) {
		return new Task(data,
			'Trade ' + data.what + ' for <span class="bold">' + data["for"] + "</span>", {
				// TODO change url 
				"url": '/me/building/' + data.building + '/build',
				"data": data,
				"type": 'GET'
			},
			function(task) {
				task.data.receive = new Resources({
					resources: {}
				});
				task.data.give = new Resources({
					resources: {}
				});
				if (data['for'] === 'gold') {
					task.data.receive = Resources.combine(task.data.receive, game.unit.trade(task.data.resources.element_wood, 0.10, "gold"));
					task.data.receive = Resources.combine(task.data.receive, game.unit.trade(task.data.resources.element_food, 0.50, "gold"));
					task.data.receive = Resources.combine(task.data.receive, game.unit.trade(task.data.resources.element_stone, 0.20, "gold"));
					task.data.give.people = task.data.receive.people;
					task.data.give.resources.wood = task.data.resources.element_wood;
					task.data.give.resources.food = task.data.resources.element_food;
					task.data.give.resources.stone = task.data.resources.element_stone;
				} else {
					task.data.receive = Resources.combine(task.data.receive, game.unit.trade(task.data.resources.element_wood, 5, "wood"));
					task.data.receive = Resources.combine(task.data.receive, game.unit.trade(task.data.resources.element_food, 25, "food"));
					task.data.receive = Resources.combine(task.data.receive, game.unit.trade(task.data.resources.element_stone, 10, "stone"));
					task.data.give.resources.gold = parseInt(task.data.resources.element_wood) + parseInt(task.data.resources.element_stone) + parseInt(task.data.resources.element_food);
					task.data.give.people = task.data.receive.people;
				}
				game.player.consumeResources(task.data.give);
			},
			function(task) {
				game.player.giveResources(task.data.receive);
			},
			"static/img/game/buildings/trade.png");
	},
	// move units to or from a friend city
	"send_units": function(data) {
		return new Task(data,
			'Sending <span class="bold">' + data.options.element_units + '</span> military units' + " to </span><span class='bold'>" + HTML_Engine.worldPath.getCityName(data.to) + "</span>", {
				// TODO change url 
				"url": '/me/building/' + data.building + '/build',
				"data": data,
				"type": 'GET'
			},
			function(task) {
				var resources = game.unit.military.send(task.data.options.element_units);
				game.player.city.buildings.military.people -= task.data.options.element_units;
				game.player.consumeResources(resources);
				game.cityMap.update();
				// TODO @Cristian send websocket notification
			},
			undefined,
			"static/img/game/resource/military.png");
	},
	"update_building": function(data) {
		return new Task(data,
			'Level up <span class="bold">' + data.building + "</span> to " + data.toLevel, {
				"url": '/me/building/' + data.building + '/level',
				"data": data,
				"type": 'GET'
			},
			function(task) {
				var resources = game.constructions.buildings[task.data.building].levelUp(data.toLevel);
				task.data.peopleBack = resources.people;
				game.player.city.buildings[task.data.building].status = 'upgrading';
				game.player.consumeResources(resources);
				game.cityMap.update();
			},
			function(task) {
				game.player.city.buildings[task.data.building].level++;
				game.player.city.buildings[task.data.building].status = 'Done';
				game.player.city.buildings.administration.people = parseInt(game.player.city.buildings.administration.people) + parseInt(task.data.peopleBack);
			},
			"/static/img/game/buildings/" + data.building + ".png");
	},
	"train_military": function(data) {
		return new Task(data,
			'Training <span class="bold">' + data.number + "</span> military units", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			function(task) {
				game.player.consumeResources(game.unit.military.attack(task.data.number));
			},
			function(task) {
				game.player.city.buildings.military.people = parseInt(task.data.number) + parseInt(game.player.city.buildings.military.people);
			},
			"static/img/game/resource/military.png");
	},
	"untrain_military": function(data) {
		return new Task(data,
			'Reduce <span class="bold">' + data.number + "</span> military units", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			undefined,
			function(task) {
				game.player.city.buildings.military.people = parseInt(game.player.city.buildings.military.people) - parseInt(task.data.number);
			},
			"static/img/game/resource/military.png");
	},
	"train_free": function(data) {
		return new Task(data,
			'Creating <span class="bold">' + data.number + "</span> free people", {
				"url": '/me/people/create',
				"data": data,
				"type": 'POST'
			},
			function(task) {
				game.player.consumeResources(game.unit.free.create(task.data.number));
			},
			function(task) {
				game.player.city.buildings.administration.people = parseInt(task.data.number) + parseInt(game.player.city.buildings.administration.people);
			},
			"static/img/game/resource/people.png");
	},
	/*
	 * Training workers
	 */
	
	/**
	 * It trains workers
	 * @param {object} data It contain from, to and number. The field 'data.to' represents the building
	 * @example In order to train 2 farmers: data.from = administration, data.to = farm, data.number = 2
	 * @example In order to train 1 miner: data.from = administration, data.to = mine, data.number = 1
	 * 
	 */
	"train_workers": function(data) {
		return new Task(data,
			'Training <span class="bold">' + data.number + "</span> " + game.constructions.buildings[data.to].worker(parseInt(data.number)), {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			/**
			 * It is called after the confirmation
			 * @param {Task} task The current task
			 */
			function(task) {
				/*
				 * Consume resources for that type of worker 
				 */
				game.player.consumeResources(game.unit[task.data.to].create(task.data.number));
			},
			/**
			 * It is called before the task is removed
			 * @param {Task} task The current task
			 */
			function(task) {
				/*
				 * Adds the number of workers back to that building 
				 */
				game.player.city.buildings[task.data.to].people 	= parseInt(task.data.number) + parseInt(game.player.city.buildings[task.data.to].people);
			},
			"static/img/game/resource/people.png");
	},
	/**
	 * It untrains workers
	 * @param {object} data It contain from, to and number. The field 'data.from' represents the building
	 * @example In order to untrain 2 farmers:data. from = farm, data.to = administration, data.number = 2
	 * @example In order to untrain 1 miner: data.from = mine, data.to = administration, data.number = 1
	 * 
	 */
	"untrain_workers": function(data) {
		return new Task(data,
			'Reduce <span class="bold">' + data.number + "</span> " + game.constructions.buildings[data.to].worker(parseInt(data.number)), {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			undefined,
			/**
			 * It is called before the task is removed
			 * @param {Task} task The current task
			 */
			function(task) {
				game.player.city.buildings[task.data.from].people 	= parseInt(game.player.city.buildings[task.data.from].people) - parseInt(task.data.number);
			},
			"static/img/game/resource/people.png");
	},
	"create_building": function(args) {
		var data = {};
		data.cell = game.cityMap.getSelectedCell();
		data.building = $(args).attr("building_name");

		return new Task(data,
			'Create building ' + data.building, {
				"url": '/me/building/' + data.building + '/build',
				"type": 'GET'
			},
			function(task) {
				// create building
				if (task.data.building !== "house") {
					game.player.city.buildings[task.data.building].level = 1;
				}
				var resources = game.constructions.buildings[task.data.building].levelUp(1);
				task.data.peopleBack = resources.people;
				game.player.city.buildings[task.data.building].status = 'under_construction';
				game.cityMap.array[data.cell.x - 1][data.cell.y - 1].type_construction = "building";
				game.cityMap.array[data.cell.x - 1][data.cell.y - 1].id_construction = game.constructions.buildings[task.data.building].id;
				game.cityMap.update();
				game.player.consumeResources(resources);
			},
			function(task) {
				game.player.city.buildings[task.data.building].num++;
				game.player.city.buildings[task.data.building].status = 'Done';
				game.player.city.buildings.administration.people = parseInt(game.player.city.buildings.administration.people) + task.data.peopleBack;
			},
			"/static/img/game/buildings/" + data.building + ".png");
	},
	"sendMessage": function(data) {
		return new Task(data,
			'Sending message to <span class="bold">' + game.worldMap.getCityById(data.to).name + "</span>", {
				// TODO change this url to the right one
				"url": '/me/send/',
				"data": data,
				"type": 'POST'
			}, undefined, undefined, undefined);
	},
};