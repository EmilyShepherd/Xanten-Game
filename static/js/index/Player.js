
/**
 * It creates a player. The player holds information regarding the city, name, level id
 * @param (object) info 		The information object	
 * @returns (object) Plyayer	The player
 */
var Player = function(info){
	this.id			= info.id; 
	this.name		= info.name;
	this.level		= info.level;
	this.resources	= new Resources((info.resources?info.resources:{}));	
	this.city 		= (info.buildings)?(new City(info.buildings)):{};
};

Player.prototype.consumeResources = function(resourcesToConsume){
	for(resource in resourcesToConsume){
		if(resource !== 'seconds' && resource !== 'people' ){
			game.player.resources[resource] -= resourcesToConsume[resource];
		}
	}
	game.resources.updateResources();
};


var City = function(buildings){
	this.buildings = buildings;
}

/**
 * It sums the number of all people for the city
 * @returns (number) The number of all the people from the city
 */
City.prototype.getNumberOfPeople = function() {
	var people = 0;
	for(building in this.buildings){
		if(this.buildings[building].people) {
			people += parseInt(this.buildings[building].people);
		}
	}	
	return people;
}