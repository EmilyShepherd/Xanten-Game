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
			game.performAction('clear', null);
		}
		
		// alert('You hit the square '+x+' '+y+ ' from world map. This map has no selectCell method yet')
		// TODO waiting for python team
	};

	/**
	 * It renders the information of the array in the images. 
	 */
	map.render = function(){
		for(i=1; i <= this.array.length; i++){
			for(j=1; j <= this.array.length; j++){
				var cell 		= $(this.HTML_element + " #cel_"+i+"_"+j),
					array_bg	= this.array[(i-1)][(j-1)],
					background 	= game.data.world_map_backgrounds[array_bg.id_background];
				
				cell.removeClass();
				
				if(background.allowCity && array_bg.id_city) {	
					cell.addClass("allow_city");	
					var player 	= game.worldMap.getCityById(array_bg.id_city);
					cell.html(HTML_Engine.getBuilding.image("administration", player.level, 98) + "<span class='level'>" + player.level + "</span>" + "<span class='description'>"+player.name.capitalize()+"</span>");
					$(this.HTML_element+" #cel_"+i+"_"+j+" img").addClass('hasAction');	
					$(this.HTML_element+" #cel_"+i+"_"+j+" img").attr({"name_of_building": player});	
				} 			
				$(this.HTML_element + " #cel_"+i+"_"+j).css('background-image', 'url(/static/img/game/background/world/' + background.img + ')');
			}
		}
		
		this.renderAttacks();
		this.renderTrades();
	};
	
	
	map.renderAttacks = function(){
		
		console.log('da');
		
		var instance = this; //make the variables global, so you can access them in the animation function
		this.raphael.line = [];
	
		 	var	discattr = {
			    stroke: "none"
			};
		 	
		 if(this.raphael.e){
			 clearInterval(instance.raphael.animation);
			 instance.raphael.e.remove();
			 instance.raphael.text.remove();
		 }
		  
		  function generate(x,y, zx, zy){
			 				
			    /*var ax = Math.floor(Math.random() * 20) + x;
			    var ay = Math.floor(Math.random() * 20) + (y - 10);
			    var bx = Math.floor(Math.random() * 20) + (zx - 20);
			    var by = Math.floor(Math.random() * 20) + (zy - 10);
			    
			    return ["C", ax, ay, bx, by, zx, zy];*/
			    return ["L", x, y];
		  }
			
			function curve(path, colour) {
				
				var x = path[0][0], y= path[0][1];

				var pixel = 100;
				
				for(var i=1; i<=path.length-1; i++){

					x = path[i][0] ;
					y = path[i][1];
					
					var zx = path[i][0];
					var zy = path[i][1];					
					
					instance.raphael.line.push(generate(x* pixel + 50 , y* pixel + 50, zx* pixel + 50, zy* pixel + 50));
					
				}
			    
				instance.raphael.line.unshift(["M", path[0][0] * pixel + 50, path[0][1] * pixel + 50])
						
				console.log(instance.raphael.line);
				
			    instance.raphael.e = instance.raphael.obj.circle(path[0][0] * pixel + 30, path[0][1] * pixel + 30, 10, 10).attr({
			        stroke: "none",
			        fill: "rgb(246, 235, 186)"
			    });
				
				instance.raphael.myPath = instance.raphael.obj.path(instance.raphael.line).attr({
				    stroke: colour,
				    "stroke-width": 4,
				"stroke-linecap": "round"
				        });
				
				instance.raphael.text = instance.raphael.obj.text(path[0][0] * pixel + 30, path[0][1] * pixel + 30, "Attack");
				
				    controls = instance.raphael.obj.set(
				    		instance.raphael.obj.circle(x, y, 5).attr(discattr), instance.raphael.obj.circle(zx, zy, 5).attr(discattr));
			}
			
			function animate(){
			    if(instance.raphael.myPath.getTotalLength() <= instance.counter){   //break as soon as the total length is reached
			        clearInterval(instance.raphael.animation);
			        instance.raphael.e.remove();
			        instance.raphael.text.remove();
			        return;
			    }
			    var pos = instance.raphael.myPath.getPointAtLength(instance.raphael.counter);   //get the position (see Raphael docs)
			    instance.raphael.e.attr({cx: pos.x, cy: pos.y});  //set the circle position
			    instance.raphael.text.attr({cx: pos.x, cy: pos.y});  //set the circle position
			    
			    instance.raphael.counter++; // count the step counter one up
			};
			
			var path = [[0, 0], [0, 1], [1, 2], [2, 2], [3, 1]]
			
			curve(path,"rgb(160, 123, 75)");
			
			this.raphael.animation = window.setInterval(animate, 500);  //execute the animation function all 10ms (change the value for another speed)

		    this.raphael.counter = 0;    // a counter that counts animation steps
		
	};
	
	map.renderTrades = function(){
		
	}

	map._select = function(){
		$("#raphael").show();
	};

	map._hide = function(){
		$("#raphael").hide();
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