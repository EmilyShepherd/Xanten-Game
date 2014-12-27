
/**
 * A resource object. It processes the resources
 * @param (object) obj 
 * @returns (object)
 */
var Resources = function(obj){
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


/**
 *  It combines 2 resources object
 *  @param (object) First object
 *  @param (object) Second object
 *  @return (object) The combination
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
};