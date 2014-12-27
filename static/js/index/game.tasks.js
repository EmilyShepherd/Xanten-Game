/**
 * The tasks of the game
 * @see Task
 */
game.tasks = {
	"train_military": function(args) {

	},
	"create_building": function(args) {
		var data = {},
			imageSource = $(args).children('img').attr("src");
		data["building"] = $(args).attr("building_name");


		return new Task(data,
			'Create building ' + data["building"], {
				"url": '/me/building/' + data["building"] + '/build',
				"type": 'GET'
			},
			function(task) {
				// create building
				if (task.data.building !== "house") {
					game.player.buildings[task.data.building].level = 1;
				}
				game.player.buildings[task.data.building].status = 'under_construction';
				var c = game.cityMap.getSelectedCell();
				game.cityMap.array[c.x][c.y].type_construction = "building";
				game.cityMap.array[c.x][c.y].id_construction = game.getBuildingDataByName(task.data.building).id;
				game.cityMap.update(); // change the status of the city map
				game.consumeResources(game.constructions.buildings[task.data["building"]].levelUp(1));
			},
			undefined,
			undefined,
			function(task) {
				game.player.buildings[task.data.building].num++;
				game.player.buildings[task.data.building].status = 'Done';
			},
			imageSource);
	}
};