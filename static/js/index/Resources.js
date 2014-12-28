/**
 * @file Represents Resources object.
 * @author JavaScript Team. Team M
 * @version 30.12.2014
 */

/**
 * A resource object. It Math.rounds the numeric resources
 * @param {object} obj 
 * @returns (Resources)
 * @constructor
 */
var Resources = function(obj){
	for (var prop in obj) {
		if(prop !== "resources" && prop !== 'interval' && prop !== "unit"){
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


/**
 *  It combines 2 resources object
 *  @param {Resources} First object
 *  @param {Resources} Second object
 *  @return {Resources} The combination of both
 *  @memberOf Resources
 */
Resources.combine = function(r1, r2){
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
	
	return new Resources(r1);
};