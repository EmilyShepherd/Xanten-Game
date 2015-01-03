/**
 * @file It contains the object Player 
 * @author Cristian Sima
 * @version 30.12.2014
 */

/**
 * A player contains information regarding the current player: resources, city, name and id
 * @constructor
 * @param (object) info 		The object which holds information regarding the player (it must have id, name, resources, and buildings).	
 * @returns (object) Player		The player
 */
var Player = function(info){
	
	this.id			= info.id; 
	this.name		= info.name;
	this.resources	= new Resources((info.resources?info.resources:{}));	
	this.city 		= (info.buildings)?(new City(info.buildings)):{};
};

/**
 * It returns the level of player. The level of player is the same as the level of city (the level of city is given by the level of administration building)
 * @return {number} level The level of the player
 * @memberOf Player.prototype
 */
Player.prototype.getLevel = function(){
	return this.city.getLevel();
};

/**
 * It consumes the given resources: gold, food, stone and wood, people from administration (free people) and people from military. Then, it updates the window
 * @param {Resources} resourcesToConsume An Resources object which holds the resources to be consumed
 * @see Resources
 * @memberOf Player.prototype
 */
Player.prototype.consumeResources = function(resourcesToConsume){
	if(resourcesToConsume.resources) {
		for(resource in resourcesToConsume.resources){
			if(resource === 'military' ) {
				this.city.buildings.military.people -= resourcesToConsume.resources[resource];
			} else {
				this.resources[resource] -= resourcesToConsume.resources[resource];
			}
		}
	}
	if(resourcesToConsume.people) {
		this.city.buildings.administration.people -= resourcesToConsume.people;
	}
	Window.updateResources();
	Window.updateStatistics();
};

/**
 * It adds the given resources: gold, food, stone and wood, people from administration (free people) and people from military. Then, it updates the window
 * @param {Resources} resourcesToConsume An Resources object which holds the resources to be added
 * @see Resources
 * @memberOf Player.prototype
 */
Player.prototype.giveResources = function(resourcesToAdd){
	if(resourcesToAdd.resources) {
		for(resource in resourcesToAdd.resources){
			if(resource === 'military' ) {
				this.city.buildings.military.people = parseInt(this.city.buildings.military.people) + parseInt(resourcesToAdd.resources[resource]);
			} else {
				this.resources[resource] = parseInt(this.resources[resource]) + parseInt(resourcesToAdd.resources[resource]);
			}
		}
	}
	if(resourcesToAdd.people) {
		this.city.buildings.administration.people =  parseInt(this.city.buildings.administration.people) + parseInt(resourcesToAdd.people);
	}
	Window.updateResources();
	Window.updateStatistics();
};