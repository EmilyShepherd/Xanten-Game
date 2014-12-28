/**
 * The actions of the game
 * @see Action
 * @memberOf Game.prototype
 */
game.actions = {
	"game_over": function(args) {
		return new Action("Actions", HTML_Engine.gameOver, function() {
			game.currentMap.deselect();
		});
	},
	"available_buildings": function(args) {
		return new Action("Create a building", HTML_Engine.getAvailableBuildings, function() {
			game.currentMap.deselect();
		});
	},
	"selectCity": function(args) {
		return new Action("Actions city", HTML_Engine.selectCity, function() {
			game.worldMap.deselect();
		});
	},
	"sendMessage": function(args) {
		return new Action("Send Message", HTML_Engine.sendMessage, function() {
			game.worldMap.deselect();
		});
	},
	"tradeResources": function(args) {
		return new Action("Trade resources", HTML_Engine.trade, function() {
			game.worldMap.deselect();
		});
	},
	"attackCity": function(args) {
		return new Action("Starting the attack", HTML_Engine.attackCity, undefined);
	},
	"city-map-selected": function(args) {
		return new Action("Your city", HTML_Engine.cityMapSelected, undefined);
	},
	"world-map-selected": function(args) {
		return new Action("World map", HTML_Engine.worldMapSelected, undefined, {
			"url": "/game/",
			/* should be the address of the world map*/
			"cb": function(information) { /*change world map*/
				game.worldMap.render();
			}
		});
	},
	"no_action": function(args) {
		return new Action("No action", HTML_Engine.noAction, undefined);
	},
	"start_task": function(args) {
		return new Action("Actions", HTML_Engine.loadAction, undefined);
	},
	"clear": function(args) {
		return new Action("Actions", "", undefined);
	},
	"inside_building": function(args) {
		return new Action(HTML_Engine.getBuilding.name(args.name, game.player.getLevel()), (function() {
				var name = args.name;
				if (game.player.city.buildings[name].status === 'under_construction') {
					return HTML_Engine.buildingUnderConstruction;
				} else {
					return HTML_Engine["inside_" + args.name];
				}
			})(),
			function() {
				game.currentMap.deselect();
			})
	}
};