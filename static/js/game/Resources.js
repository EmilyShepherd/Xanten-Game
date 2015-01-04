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
var Resources = function(obj) {
	for (var prop in obj) {
		if (prop !== "resources" && prop !== 'interval' && prop !== "unit") {
			obj[prop] = Math.round(obj[prop]);
		}
	}
	if (obj.resources) {
		for (var r in obj.resources) {
			if (r !== 'military') {
				obj.resources[r] = Math.round(obj.resources[r]);
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
Resources.combine = function(r1, r2) {

	if (r1.interval !== r2.interval) {
		console.log('Impossible');
		return;
	}

	for (var prop in r2) {
		if (prop !== "resources") {
			if (r1[prop]) {
				r1[prop] = parseInt(r1[prop]) + parseInt(r2[prop]);
			} else {
				r1[prop] = r2[prop];
			}
		}
	}

	if (!r1.resources) {
		r1.resources = {};
	}

	for (var r in r2.resources) {
		if (r1.resources[r]) {
			r1.resources[r] = parseInt(r1.resources[r]) + parseInt(r2.resources[r]);
		} else {
			r1.resources[r] = r2.resources[r];
		}
	}

	return new Resources(r1);
};