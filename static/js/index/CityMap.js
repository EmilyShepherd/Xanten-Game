/**
 * Represents a city map object.
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */

/**
 * It represents a cityMap object. It extends the XantenMap object
 * @param array The array of the map
 */
var CityMap = function(array){
	
	// extends
	var map 						= new XantenMap(array, 'city');
	map.__proto__                 	= "CityMap";
		
	
	/**
	 * It selects a cell
	 * @param x The x coordinate
	 * @param y The y coordinate
	 */
	map.selectCell = function(x, y){
		this.deselect();	

		if($(this.HTML_element + " #cel_"+x+"_"+y).hasClass('allow_construction')){
			game.performAction('available_buildings');
			this.selectBackground(x, y);
		}
		else if($(this.HTML_element+" #cel_"+x+"_"+y+" img").hasClass('hasAction')){
			game.performAction('inside_building_military');
			this.selectImage(x, y);
		}else {
			game.performAction('no_action', null);
		}
	};

	
	/**
	 * It renders the information of the array in the images
	 */
	map.render = function(){
		// TODO
	};
	
	return map;
}