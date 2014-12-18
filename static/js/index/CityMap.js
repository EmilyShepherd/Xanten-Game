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
			var building = $(this.HTML_element+" #cel_"+x+"_"+y+" img").attr("name_of_building");
			game.performAction('inside_'+building);
			this.selectImage(x, y);
		}else {
			game.performAction('no_action', null);
		}
	};

	
	/**
	 * It renders the information of the array in the images
	 */
	map.render = function(){		
		for(i=1; i<=this.array.length; i++){
			for(j=1; j<=this.array.length; j++){
				var cell = $(this.HTML_element + " #cel_"+i+"_"+j);				
				cell.removeClass();				
				var background = game.data.city_map_background[this.array[(i-1)][(j-1)].id_background];
				if(background.allowBuildings === true){					
					if(background.allowBuildings === true && this.array[(i-1)][(j-1)].type_construction !== "building"){			
						cell.addClass("allow_construction");	
					}
					else {
						// building
						var building = game.data.city_map_buildings[this.array[(i-1)][(j-1)].id_construction];
						cell.html(HTML_Engine.getBuilding.image(building.name+"", game.player.level, 70));

						$(this.HTML_element+" #cel_"+i+"_"+j+" img").addClass('hasAction');	
						$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"name_of_building": building.name.toLowerCase()});	
						$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"title": building.name.capitalize()});	
					}
					// background	
				} else {
					// TODO @Cristian Elements
				}				
				// background
				$(this.HTML_element + " #cel_"+i+"_"+j).css('background-image', 'url(/static/img/game/background/city/' + background.img + ')');
			}
		}
	};	
	return map;
}