/**
 * @file Represents a player object.
 * @author Cristian Sima
 * @version 30.12.2014
 */

/**
 * It creates a player. The player holds information regarding the city, name, level id
 * @constructor
 * @param (object) info 		The information object	
 * @returns (object) Player		The player
 */
var Player = function(info){
	
	this.id			= info.id; 
	this.name		= info.name;
	this.resources	= new Resources((info.resources?info.resources:{}));	
	this.city 		= (info.buildings)?(new City(info.buildings)):{};
};

/**
 * It returns the level of player (same as level of city)
 * @return {number} level The level of city
 * @memberOf Player.prototype
 */
Player.prototype.getLevel = function(){
	return this.city.getLevel();
};

/**
 * It consumes the given resources (also people from administration and military from military). Then, it updates the window
 * @param {object} resourcesToConsume An Resources object to consume
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
};

/**
 * It adds the resources to the player
 * @param {object} resourcesToConsume An Resources object to add
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
};