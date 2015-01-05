/**
 * The actions of the game
 * @see Action
 * @memberOf Game.prototype
 */
game.actions = {
	"game_over": function() {
		return new Action("Actions", HTML_Engine.gameOver, function() {
			game.currentMap.deselect();
		});
	},
	"seeMessage": function(args) {
		return new Action("Message nr. " + args.id, HTML_Engine.seeMessage, function() {});
	},
	"messages": function() {
		return new Action("All messages", HTML_Engine.messages, function() {});
	},
	"available_buildings": function() {
		return new Action("Create a building", HTML_Engine.getAvailableBuildings, function() {
			game.currentMap.deselect();
		});
	},
	"selectCity": function() {
		return new Action("Actions city", HTML_Engine.selectCity, function() {
			game.worldMap.deselect();
		});
	},
	"sendMessage": function() {
		return new Action("Send Message", HTML_Engine.sendMessage, function() {
			game.worldMap.deselect();
		});
	},
	"tradeResources": function() {
		return new Action("Trade resources", HTML_Engine.trade, function() {
			game.worldMap.deselect();
		});
	},
	"sendUnits": function() {
		return new Action("Send units to city", HTML_Engine.sendUnits, undefined);
	},
	"attackCity": function() {
		return new Action("Starting the attack", HTML_Engine.attackCity, undefined);
	},
	"city-map-selected": function() {
		return new Action("Your city", HTML_Engine.cityMapSelected, undefined);
	},
	"world-map-selected": function() {
		return new Action("World map", HTML_Engine.worldMapSelected, undefined, {
			"url": "/game/",
			/* should be the address of the world map*/
			"cb": function() { /*change world map*/
				game.worldMap.render();
			}
		});
	},
	"no_action": function() {
		return new Action("No action", HTML_Engine.noAction, undefined);
	},
	"start_task": function() {
		return new Action("Actions", HTML_Engine.loadAction, undefined);
	},
	"clear": function() {
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
			});
	}
};