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
		
		for(i=0; i<=this.length-1; i++){
			for(j=0; j<=this.length-1; j++){					
				var cell = $(this.HTML_element + " #cel_"+i+"_"+j);				
				cell.removeClass();				
				var background = game.game_city_map_background(this.array[i][j].id_background);
				if(background.allowBuildings){					
					if(!this.array[i][j].id_building){
						cell.addClass("allow_construction");						
					}
					else {
						// building
						var building = game.game_city_map_buildings(this.array[i][j].id_building);
						cell.html(HTML_Engine.getBuilding(building.name));
					}
					// background	
				} else {
					// TODO @Cristian Elements
				}
				
				// background
				$(this.HTML_element + " #cel_"+i+"_"+j).css('background-image', 'url(/static/img/game/city/' + background.img + ')');
			
			}

		}
	};
	
	return map;
}