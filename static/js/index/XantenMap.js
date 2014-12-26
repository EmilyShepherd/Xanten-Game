/**
 * Represents a map object
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */



/**
 * The map object
 * @param mapArray The array
 * @param name It should be city or world
 */
function XantenMap(array, name){
	this.array 				= array;
	this.selectedCell 		= null;
	this.name 				= name;
	this.HTML_element		= "#map-board-"+this.name;
	this.selectedCell		= null;
}

/**
 * It returns the array
 * @returns arrray The array of the map
 */
XantenMap.prototype.getArray = function(){
	return this.array;
}

/**
 * It returns the array
 * @returns arrray The array of the map
 */
XantenMap.prototype.getSize = function(){
	return this.array.length;
}

XantenMap.prototype.getSelectedCell = function(){
	return this.selectedCell;
}


/**
 * It deselects any square from the map
 */
XantenMap.prototype.deselect = function(){
	$(this.HTML_element+" td").removeClass('selected');
	$(this.HTML_element+" img").removeClass('selected');
}

/**
 * It selects an image from the map
 * @param x The x coordinate of the map
 * @param y The y coordinate of the map
 */
XantenMap.prototype.freeze = function(){
	this.selectCell = function(){};
	if(this._freeze){
		this._freeze();
	}
};

/**
 * It selects an image from the map
 * @param x The x coordinate of the map
 * @param y The y coordinate of the map
 */
XantenMap.prototype.selectImage = function(x, y){
	$($(this.HTML_element+" #cel_"+x+"_"+y).find("img")).addClass('selected');
};

/**
 * It selects a background from the map
 * @param x The x coordinate of the map
 * @param y The y coordinate of the map
 */
XantenMap.prototype.selectBackground = function(x,y){
	$(this.HTML_element+" #cel_"+x+"_"+y).addClass('selected');	
};

/**
 * It is called when the user clicked on the square of the map. It must be overriden 
 */
XantenMap.prototype.selectCell = function(x, y){
	alert('The selectCell method for '+this.name+' map must be overriden.');
};

/**
 * It creates the table for the map and it links the listeners for the squares. It is called ones
 */
XantenMap.prototype.init = function(){	


	
	var instance = this;	// save a reference for lambda functions
	var table    = '';
	var div 	 = '';
	
	//  Plese do not modify this! The code is working but I'm waiting for the python team 
	 
	
	table = "<table id='map-board-" + this.name + "' class='map' border='0' cellspacing='0'><tbody>";
	
	for(vertical = 1; vertical <= this.getSize(); vertical++){
		table += '<tr>';
		for(horizontal = 1; horizontal <= this.getSize(); horizontal++){
			table += '<td id="cel_' + vertical + '_' + horizontal + '"></td>';
		}
		table += '</tr>';
	}
	
	table 	+= "</tbody></table>";
	div 	= "<div id='map-window-" + this.name + "' class='map-window'>" + table + "</div>";
	$("#map-window").append(div);

	
	
	$("#map-board-"+this.name+" td").click(function(){
		var id = $(this).attr("id");
		var array = id.substring(4, id.length);
		var elements = array.split("_");
		instance.selectedCell = {
				x:  elements[0]-1,
				y: elements[1]-1
		};
		instance.selectCell(elements[0], elements[1]);
	});
	
	if(this._init){
		this._init();
	}
	
	this.render();
};


/**
 * It calls the render and shows the map
 */
XantenMap.prototype.select = function(){
	
	$(this.HTML_element).fadeIn("slow");
	$("#map-window-"+this.name).show();
	$("#map-board-city-"+this.name).show();
	if(this._select){
		this._select();
	}
};

/**
 * It calls the deselect method and then hides the map
 */
XantenMap.prototype.hide = function(){
	this.deselect();
	$(this.HTML_element).hide();
	if(this._hide){
		this._hide();
	}
};

/**
 * It changes the map backgrounds and images.
 */
XantenMap.prototype.update = function(){
	this.render();
};

/**
 * It changes the map backgrounds and images.
 */
XantenMap.prototype.render = function(){
	alert('The render method for '+this.name+' map must be overriden.');
};