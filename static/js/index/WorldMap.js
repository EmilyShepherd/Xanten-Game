/**
 * Represents a world map object.
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */

/**
 * It represents a WorldMap object. It extends the XantenMap object
 * @param array The array of the map
 */
 function WorldMap(array){
	 
	// extends
	var map 		= new XantenMap(array, 'world');
	map.__proto__ 	= "WorldMap";
	
	/**
	 * It selects a cell
	 * @param x The x coordinate
	 * @param y The y coordinate
	 */
	map.selectCell = function(x, y){
		//this.deselect();	
		alert('You hit the square '+x+' '+y+ ' from world map. This map has no selectCell method yet')
		// TODO waiting for python team
	};

	/**
	 * It renders the information of the array in the images. 
	 */
	map.render = function(){
		// TODO waiting for python team
	};
	
	return map;
 }