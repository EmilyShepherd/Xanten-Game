/**
 * @file Represents a City object.
 * @author Cristian Sima
 * @version 30.12.2014
 */

/**
 * It represents a city for the current player.
 * @constructor 
 * @param {object} buildings An object which contains all the buildings
 * @return {City} The city object
 * @property {object} buildings An object which holds all the buildings of the city. <br /> Each building has: <ul><li> level (the level of building</li><li> num (number of this type) </li><li>people: number of people</li></ul>
 */
var City = function(buildings){
	this.buildings = buildings;
};

/**
 * It sums the number of all people for the city
 * @returns {number} The number of all the people from the city
 * @memberOf City.prototype
 */
City.prototype.getNumberOfPeople = function() {
	var people = 0;
	for(building in this.buildings){
		if(this.buildings[building].people) {
			people += parseInt(this.buildings[building].people);
		}
	}	
	return people;
};

/**
 * It returns the level of city
 * @return {number} level The level of city
 * @memberOf City.prototype
 * @see City.prototype.buildings
 */
City.prototype.getLevel = function(){
	return this.buildings.administration.level;
};