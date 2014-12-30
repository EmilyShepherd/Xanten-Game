/**
 * @fileOverview Represents a world map object.
 * @author Cristian Sima
 * @version 30.12.2014
 */



/**
 * It represents a WorldMap object. It extends the XantenMap object
 * @constructor
 * @extends XantenMap
 * @param array The array of the map
*/
function WorldMap(obj){
	
	var WorldMap	 		= new XantenMap(obj.array, 'world');
	WorldMap.__proto__ 		= "WorldMap";
	WorldMap.players		= obj.players;
	WorldMap.backgrounds	= obj.backgrounds;
	
	/**
	 * 
	 * @memberOf WorldMap.prototype 
	 * @param x The x coordinate
	 * @param y The y coordinate
	 */
	WorldMap.selectCell = function(x, y){
		
		var id_selected_city = this.getCityByPosition(x, y);
		if(id_selected_city){
			if(id_selected_city !== game.player.id){
				game.performAction("selectCity", id_selected_city);
			} else {
				game.performAction("city-map-selected");
			}
			this.selectImage(x, y);
		} else {
			game.performAction('clear', null);
		}
		
		// alert('You hit the square '+x+' '+y+ ' from world map. This map has no selectCell method yet')
		// TODO waiting for python team
	};

	/**
	 * It renders the information of the array into Graphical form
	 * @memberOf WorldMap.prototype 
	 */
	WorldMap.render = function(){
		for(i=1; i <= this.array.length; i++){
			for(j=1; j <= this.array.length; j++){
				var cell 		= $(this.HTML_element + " #cel_"+i+"_"+j),
					array_bg	= this.array[(i-1)][(j-1)],
					background 	= this.backgrounds[array_bg.id_background];
				
				cell.removeClass();
				
				if(background.allowCity && array_bg.id_city) {	
					cell.addClass("allow_city");	
					var player 	= this.getCityById(array_bg.id_city);
					cell.html(HTML_Engine.getBuilding.image("administration", player.level, 98) + "<span class='level'>" + player.level + "</span>" + "<span class='description'>"+player.name.capitalize()+"</span>");
					$(this.HTML_element+" #cel_"+i+"_"+j+" img").addClass('hasAction');	
					$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"name_of_building": player});	
				} 			
				$(this.HTML_element + " #cel_"+i+"_"+j).css('background-image', 'url(/static/img/game/background/world/' + background.img + ')');
			}
		}		
		// this.renderTrades();
		// this.renderAttacks();
	};
		
	 
 	/** 
 	 * It returns the city using the id
 	 * @param id The id of the city
	 * @return (object) An object with information regarding the city
	 * @memberOf WorldMap.prototype
	 */
	WorldMap.getCityById = function(id){
		return this.players[id];
	};
	
	/**
	 * It returns the id of the city based on the position on the world map
	 * @param (number) x The x position
	 * @param (number) y The y position
	 * @return (number) The id of the city or null if nothing is there
	 * @memberOf WorldMap.prototype
	 */
	WorldMap.getCityByPosition = function(x, y){
		return this.array[(x-1)][(y-1)].id_city;
	};
	
	/**
	 * It returns the position of a city on the map
	 * @param (number) id The id of the city
	 * @return (object) An object with the x and y position
	 * @memberOf WorldMap.prototype
	 */
	WorldMap.getCityPositionById = function(id){
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
		
	/**
	 * It deletes all the paths and stops the ticker listener
	 * @memberOf WorldMap.prototype
	 */
	WorldMap._freeze = function(){
	}
	
	return WorldMap;
 }