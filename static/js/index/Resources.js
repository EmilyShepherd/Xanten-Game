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
	
	$("#resource #gold").html(game.player.resources.gold);
	$("#resources #stone").html(game.player.resources.stone);
	$("#resources #wood").html(game.player.resources.wood);
	$("#resources #food").html(game.player.resources.food);	
};

/**
 * It updates the number of people
 */
Resources.prototype.updatePeople = function() {
	$("#resources #people").html(game.resources.food);	
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
 * @param building_id The name of the building
 * @param state It is 'create' or 'upgrade'
 * @return object an object with the necessary resources
 */
Resources.prototype.getNecessaryForBuilding = function(building_name, state){
	
	 // TODO to be done
	return {'wood': randomnumber=Math.floor(Math.random()*201)+1, 
			'stone': randomnumber=Math.floor(Math.random()*201)+1,
			'people': randomnumber=Math.floor(Math.random()*21)+1,
			'seconds': randomnumber=Math.round(Math.random()*1, 2)+2
			};
};
