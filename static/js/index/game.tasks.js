/**
 * The tasks of the game
 * @see Task
 * @memberOf Game.prototype
 */
game.tasks = {
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
					game.player.city.buildings.administration.people = parseInt(game.player.city.buildings.administration.people) + task.data.peopleBack;
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
			
			data["building"] = $(args).attr("building_name");
	
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
					game.player.city.buildings[task.data.building].status = 'under_construction';
					var c = game.cityMap.getSelectedCell();
					game.cityMap.array[c.x-1][c.y-1].type_construction = "building";
					game.cityMap.array[c.x-1][c.y-1].id_construction = game.constructions.buildings[task.data.building].id;
					game.cityMap.update(); // change the status of the city map
					game.player.consumeResources(game.constructions.buildings[task.data["building"]].levelUp(1));
				},
				undefined,
				undefined,
				function(task) {
					game.player.city.buildings[task.data.building].num++;
					game.player.city.buildings[task.data.building].status = 'Done';
				},
				"/static/img/game/buildings/"+data.building+".png");
	}
};