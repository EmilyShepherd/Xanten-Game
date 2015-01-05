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
	"train_miller": function(data) {
		return new Task(data,
			'Training <span class="bold">' + data.number + "</span> millers", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			function(task) {
				game.player.consumeResources(game.unit.miller.create(task.data.number));
			},
			function(task) {
				game.player.city.buildings.mill.people = parseInt(task.data.number) + parseInt(game.player.city.buildings.mill.people);
			},
			"static/img/game/resource/people.png");
	},
	"untrain_miller": function(data) {
		return new Task(data,
			'Reduce <span class="bold">' + data.number + "</span> millers", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			undefined,
			function(task) {
				game.player.city.buildings.mill.people = parseInt(game.player.city.buildings.mill.people) - parseInt(task.data.number);
			},
			"static/img/game/resource/people.png");
	},
	"train_miner": function(data) {
		return new Task(data,
			'Training <span class="bold">' + data.number + "</span> miners", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			function(task) {
				game.player.consumeResources(game.unit.miner.create(task.data.number));
			},
			function(task) {
				game.player.city.buildings.mine.people = parseInt(task.data.number) + parseInt(game.player.city.buildings.mine.people);
			},
			"static/img/game/resource/people.png");
	},
	"untrain_miner": function(data) {
		return new Task(data,
			'Reduce <span class="bold">' + data.number + "</span> miners", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			undefined,
			function(task) {
				game.player.city.buildings.mine.people = parseInt(game.player.city.buildings.mine.people) - parseInt(task.data.number);
			},
			"static/img/game/resource/people.png");
	},
	"train_lumberjack": function(data) {
		return new Task(data,
			'Training <span class="bold">' + data.number + "</span> lumberjacks", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			function(task) {
				game.player.consumeResources(game.unit.lumberjack.create(task.data.number));
			},
			function(task) {
				game.player.city.buildings.lumberjack.people = parseInt(task.data.number) + parseInt(game.player.city.buildings.lumberjack.people);
			},
			"static/img/game/resource/people.png");
	},
	"untrain_lumberjack": function(data) {
		return new Task(data,
			'Reduce <span class="bold">' + data.number + "</span> lumberjacks", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			undefined,
			function(task) {
				game.player.city.buildings.lumberjack.people = parseInt(game.player.city.buildings.lumberjack.people) - parseInt(task.data.number);
			},
			"static/img/game/resource/people.png");
	},
	"train_farmer": function(data) {
		return new Task(data,
			'Training <span class="bold">' + data.number + "</span> farmers", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			function(task) {
				game.player.consumeResources(game.unit.farmer.create(task.data.number));
			},
			function(task) {
				game.player.city.buildings.farm.people = parseInt(task.data.number) + parseInt(game.player.city.buildings.farm.people);
			},
			"static/img/game/resource/people.png");
	},
	"untrain_farmer": function(data) {
		return new Task(data,
			'Reduce <span class="bold">' + data.number + "</span> farmers", {
				"url": '/me/people/move',
				"data": data,
				"type": 'POST'
			},
			undefined,
			function(task) {
				game.player.city.buildings.farm.people = parseInt(game.player.city.buildings.farm.people) - parseInt(task.data.number);
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