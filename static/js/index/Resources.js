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
 * @param string state It is 'create' or 'upgrade'
 * @return Object an object with the necessary resources
 */
Resources.prototype.getNecessaryForBuilding = function(building_name, state){
	
	 // TODO @Joe 
	
	
	
	// this is just to test. it does not return the right values
	return {
		resources: {
						'wood': randomnumber=Math.floor(Math.random()*20000001)+1, 
						'stone': randomnumber=Math.floor(Math.random()*20001)+1
					},
		people: randomnumber=Math.floor(Math.random()*20001)+1,
		time: randomnumber=Math.round(Math.random()*4000)
	}
};
