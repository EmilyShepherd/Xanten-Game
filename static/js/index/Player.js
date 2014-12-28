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
	this.level		= info.level;
	this.resources	= new Resources((info.resources?info.resources:{}));	
	this.city 		= (info.buildings)?(new City(info.buildings)):{};
};

/**
 * It consumes the given resources (also people from administration). Then, it updates the window
 * @param {object} resourcesToConsume An Resources object to consume
 * @see Resources
 * @memberOf Player.prototype
 */
Player.prototype.consumeResources = function(resourcesToConsume){
	for(resource in resourcesToConsume.resources){
		if(resource !== 'military' ){
			this.resources[resource] -= resourcesToConsume.resources[resource];
		}
	}
	this.city.buildings.administration.people -= resourcesToConsume.people;
	Window.updateResources();
};