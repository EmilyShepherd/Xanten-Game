/**
 * Represents the view object which displays the resources and information regarding city
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */



function Resources(){

}

/**
 * It updates the resources (gold, stone, wood, food)
 */
Resources.prototype.updateResources = function(){

	// TODO a roll like in casios of the resources

	$("#resources #stone").html(HTML_Engine.shortResourceRepresentation(game.player.resources.stone));
	$("#resources #wood").html(HTML_Engine.shortResourceRepresentation(game.player.resources.wood));
	$("#resources #food").html(HTML_Engine.shortResourceRepresentation(game.player.resources.food));
};

/**
 * It updates the number of people
 */
Resources.prototype.updatePeople = function() {
	$("#resources #people").html(Resources.shortResourceRepresentation(game.player.resources.people));
	$("#resources #gold").html(Resources.shortResourceRepresentation(game.player.resources.gold));
};

/**
 * It updates the details of the city (name, level, type of city)
 */
Resources.prototype.updateDetailsCity = function() {
	$("#city_details #name").html(game.player.city.name);
	$("#city_details #level").html("Level: "+game.player.city.level);
	$("#city_details #type").html(game.player.city.type);
};

/**
 * It returns the necesary resources for a building
 * @param string building_id The name of the building
 * @param int level The level to upgrade to
 * @return Object an object with the necessary resources
 */
Resources.prototype.getNecessaryForBuilding = function(building_name, level){
	population = game.player.resources.people
	switch(building_name) {
		case "admin":
			return {
				resources: {
					'wood': 100 * Math.pow(1.35, level),
					'stone': 100 * Math.pow(1.35, level),
					'gold': 10 * level
				},
				people: 0.05 * population,
				time: 10 * level
			}
			break;
		case "military":
			return {
				resources: {
					'wood': 10 * Math.pow(1.35, level),
					'stone': 10 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 10 * level
			}
			break;
		case "storage":
			return {
				resources: {
					'wood': 5 * Math.pow(1.35, level),
					'stone': 5 * Math.pow(1.35, level)
				},
				people: 0.05 * population,
				time: 10 * level
			}
			break;
		case "docks":
			return {
				resources: {
					'wood': 8 * Math.pow(1.35, level),
					'stone': 8 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 10 * level
			}
			break;
		case "lumberjack":
			return {
				resources: {
					'wood': 1 * Math.pow(1.35, level),
					'stone': 13 * Math.pow(1.35, level)
				},
				people: 11 * level,
				time: 5 * level
			}
			break;
		case "mine":
			return {
				resources: {
					'wood': 12 * Math.pow(1.35, level),
					'stone': 1 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 15 * level
			}
			break;
		case "grapevine":
			return {
				resources: {
					'wood': 3 * Math.pow(1.35, level),
					'stone': 2 * Math.pow(1.35, level)
				},
				people: 7 * level,
				time: 7 * level
			}
			break;
		case "trade":
			return {
				resources: {
					'wood': 7 * Math.pow(1.35, level),
					'stone': 7 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 10 * level
			}
			break;
		case "house":
			return {
				resources: {
					'wood': 2 * Math.pow(1.35, level),
					'stone': 3 * Math.pow(1.35, level)
				},
				people: 7 * level,
				time: 7 * level
				}
			break;
		default:
			return {};
	}
};
