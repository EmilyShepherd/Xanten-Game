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
 function WorldMap(data, cities){
	 
	// extends
	var map 		= new XantenMap(data.map, 'world');
	map.__proto__ 	= "WorldMap";
	map.cities		= data.cities;
	
	/**
	 * It selects a cell
	 * @param x The x coordinate
	 * @param y The y coordinate
	 */
	map.selectCell = function(x, y){
		
		this.deselect();
		
		
		// TODO @Crisian  - get information about city
		// 
		var id_selected_city = this.getCityByPosition(x, y);
		if(id_selected_city){
			if(id_selected_city !== game.player.id){
				game.performAction("selectCity", id_selected_city);
			} else {
				game.performAction("city-map-selected");
			}
			this.selectImage(x, y);
		} else {
			game.performAction('no_action', null);
		}
		
		// alert('You hit the square '+x+' '+y+ ' from world map. This map has no selectCell method yet')
		// TODO waiting for python team
	};

	/**
	 * It renders the information of the array in the images. 
	 */
	map.render = function(){
		// TODO waiting for python team
	};
	
	/**
	 * It returns the object with the information regarding the city
	 * @param (number) id The id of the city
	 * @return (object) An object with information regarding the city
	 */
	map.getCityById = function(id){
		return this.cities[id];
	};
	
	/**
	 * It returns the id of the city based on the position on the world map
	 * @param (number) x The x position
	 * @param (number) y The y position
	 * @return (number) The id of the city or null if nothing is there
	 */
	map.getCityByPosition = function(x, y){
		return this.array[(x-1)][(y-1)].id_city;
	};
	
	/**
	 * It returns the position of a city on the map
	 * @param (number) id The id of the city
	 * @return (object) An object with the x and y position
	 */
	map.getCityPositionById = function(id){
		for(i=0; i<=this.array.length-1; i++){
			for(j=0; j<=this.array.length-1; j++){
				if(array[i][j].id_city === id){
					return {
						"x" : i,
						"y" : j
					}
				}
			}
		}
	};
	
	return map;
 }