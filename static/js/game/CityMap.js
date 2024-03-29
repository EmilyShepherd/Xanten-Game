/**
 * @file Represents a city map object.
 * @author Cristian Sima
 * @version 30.12.2014
 */

/**
 * It represents a cityMap object. It extends the XantenMap object
 * @constructor
 * @extends XantenMap
 * @param {array} obj The array of the map
 */
function CityMap(obj) {
		
	var cityMap 						= new XantenMap(obj.array, 'city');
	cityMap.backgrounds					= obj.backgrounds;
	
	/**
	 * It is called when a cell is selected. 
	 * @name selectCell
	 * @memberOf CityMap.prototype
	 * @param (number) x The x coordinate
	 * @param (number) y The y coordinate
	 */
	cityMap.selectCell = function(x, y){

		if($(this.HTML_element + " #cel_"+x+"_"+y).hasClass('allow_construction')){
			game.performAction('available_buildings');
			this.selectBackground(x, y);
		}
		else if($(this.HTML_element+" #cel_"+x+"_"+y+" img").hasClass('hasAction')){
			var building = $(this.HTML_element+" #cel_"+x+"_"+y+" img").attr("name_of_building");
			game.performAction('inside_building', {name: building});
			this.selectImage(x, y);
		}else {
			game.performAction('city-map-selected', null);
		}
	};
		
	/**
	 * It renders the information of the array in the images
	 * @name render
	 * @memberOf CityMap.prototype
	 */
	cityMap.render = function(){		
		for(var i=1; i <= this.array.length; i++){
			for(var j=1; j <= this.array.length; j++){
				var cell 		= $(this.HTML_element + " #cel_"+i+"_"+j),
					background 	= this.backgrounds[this.array[(i-1)][(j-1)].id_background];				
				
				cell.removeClass();				
				
				if(background.allowBuildings === true) {					
					if(background.allowBuildings === true && this.array[(i-1)][(j-1)].type_construction === null){			
						cell.addClass("allow_construction");	
					}
					else if(this.array[(i-1)][(j-1)].type_construction === "building") {
						var building 		= game.constructions.getBuildingById(this.array[(i-1)][(j-1)].id_construction),
							img		 		= building.name,
							player_building = game.player.city.buildings[building.name];
						
						// free commercial image from https://openclipart.org/detail/149155/old-mine-by-chrisdesign
						if(player_building.status === 'under_construction'){
							img = "construction";
						}
						cell.html(HTML_Engine.getBuilding.image(img, game.player.getLevel(), 98) + (player_building.level?"<span class='" + ((player_building.status === 'upgrading')?"level_upgrading":"level") + "' >" + player_building.level + "</span>":""));
						
						$(this.HTML_element+" #cel_"+i+"_"+j+" img").addClass('hasAction');	
						$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"name_of_building": building.name.toLowerCase()});	
						$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"title": building.name.capitalize()});	
					} else {
						var element = game.constructions.getElementById(this.array[(i-1)][(j-1)].id_construction);
						cell.html(HTML_Engine.getBuilding.image(element.name + "", game.player.getLevel(), 70));
						$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"name_of_building": element.name.toLowerCase()});	
						$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"title": element.name.capitalize()});
					}					
				} 			
				$(this.HTML_element + " #cel_"+i+"_"+j).css('background-image', 'url(/static/img/game/background/city/' + background.img + ')');
			}
		}
	};	
	return cityMap;
}