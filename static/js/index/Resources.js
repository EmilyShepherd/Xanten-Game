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
 * It sums the number of all people for the city
 * @returns (number) The number of all the people from the city
 */
Resources.prototype.getAllPeopleOfCity = function(){
	var people = 0;
	for(building in game.player.buildings){
		if(game.player.buildings[building].people) {
			people += parseInt(game.player.buildings[building].people);
		}
	}	
	return people;
}

/**
 * It updates the number of people
 */
Resources.prototype.updateStatistics = function() {
	$("#resources #people").html(HTML_Engine.shortResourceRepresentation(this.getAllPeopleOfCity()));
	$("#resources #gold").html(HTML_Engine.shortResourceRepresentation(game.player.resources.gold));
};

/**
 * It updates the details of the city (name, level, type of city)
 */
Resources.prototype.updateDetailsCity = function() {
	$("#city_details #name").html(game.worldMap.data.cities[game.player.id].name);
	$("#city_details #level").html("Level: "+game.player.level);
	$("#city_details #type").html(game.getOrganizationInformationByLevel("name", game.player.level) );
};

/**
 * It returns the necesary resources for a building
 * @param string building_id The name of the building
 * @param int level The level to upgrade to
 * @return Object an object with the necessary resources
 */
Resources.prototype.getNecessaryForBuilding = function(building_name, level){
	
	function _getResources(){
		population = game.player.resources.people
		switch(building_name) {
			case "administration":
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
			case "mill":
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
			case "farm":
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
	}

	return this.prepareResources(_getResources());
};

/**
 * It returns the necessary resources for creating one unit
 * @param (string) unit The name of the unit. For eg. 'military'
 */
Resources.prototype.getCostForUnit = function(unit, number){
		
	function _getCost() {
		switch(unit){
		case "military":
			return {
						resources: {
							"wood": 80 * number,
							"food": 10 * number
						},
						time: 20 * number
				};
		break;
		case "military_daily":
			return {
				resources : {
					gold: Math.ceil(number * 70.7),
					food: Math.ceil(number * 60.3)
				},
				interval: "one day"
			};
		break;
		case "military_attack":
			return {
					resources : {
					gold: number * 30.8, /* TODO @George real resources */
					food: number * 19
				},
				interval: "one day"
			};
		break;
		}
	};
	
	return this.prepareResources(_getCost());
};

/**
 *  It combines 2 resources object
 *  @param (object) First object
 *  @param (object) Second object
 *  @return (object) The combination
 */
Resources.prototype.combine = function(r1, r2){
	var r = r1;
	
	if(r1.interval !== r2.interval){
		console.log('Impossible');
		return;
	} 
	
	for (var prop in r2) {
		if(prop !== "resources"){
			if(r1[prop]){
				r1[prop] += r2[prop];
			} else {
				r1[prop] = r2[prop];
			}		
		}
	}
	
	for (var prop in r2.resources) {
		if(r1.resources[prop]){
			r1.resources[prop] += r2.resources[prop];
		} else {
			r1.resources[prop] = r2.resources[prop];
		}
	}
};

/**
 * It creates int values for the resources before they are returned
 * @param (object) obj The object with the resources
 * @return (object) An object where the resources are rounded
 */
Resources.prototype.prepareResources = function(obj){
    
	for (var prop in obj) {
		if(prop !== "resources" && prop !== 'interval'){
			obj[prop] = Math.round(obj[prop]);
		}
	}
	
	if(obj.resources){
		for (var prop in obj.resources) {
			if(prop !== 'military'){
				obj.resources[prop] = Math.round(obj.resources[prop]);
			}
		}
	}
	
	return obj;
};
