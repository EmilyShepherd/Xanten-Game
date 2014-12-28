/**
 * @file Represents XantenMap object.
 * @author Cristian Sima
 * @version 30.12.2014
 */

/**
 * The map object
 * @constructor
 * @param {array} mapArray A 2d array which contains information regarding the map
 * @param {string} name It should be city or world
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
 * @memberOf XantenMap.prototype
 * @returns {array} The array of the map
 */
XantenMap.prototype.getArray = function(){
	return this.array;
}

/**
 * It returns the array
 * @memberOf XantenMap.prototype
 * @returns {array} The array of the map
 */
XantenMap.prototype.getSize = function(){
	return this.array.length;
}

/**
 * It returns an array with the position for the selected cell (x,y)
 * @memberOf XantenMap.prototype
 * @return {object} An object with the position of the selected cell
 */
XantenMap.prototype.getSelectedCell = function(){
	return this.selectedCell;
}


/**
 * It deselects any square from the map
 * @memberOf XantenMap.prototype
 */
XantenMap.prototype.deselect = function(){
	$(this.HTML_element+" td").removeClass('selected');
	$(this.HTML_element+" img").removeClass('selected');
	this.selectedCell = null;
}

/**
 * It selects an image from the map
 * @memberOf XantenMap.prototype
 * @param {number} x The x coordinate of the map
 * @param {number} y The y coordinate of the map
 */
XantenMap.prototype.freeze = function(){
	this.selectCell = function(){};
	if(this._freeze){
		this._freeze();
	}
};

/**
 * It selects an image from the map
 * @private
 * @memberOf XantenMap.prototype
 * @param {number} x The x coordinate of the map
 * @param {number} y The y coordinate of the map
 */
XantenMap.prototype.selectImage = function(x, y){
	$($(this.HTML_element+" #cel_"+x+"_"+y).find("img")).addClass('selected');
};

/**
 * It selects a background from the map
 * @private
 * @memberOf XantenMap.prototype
 * @param {number} x The x coordinate of the map
 * @param {number} y The y coordinate of the map
 */
XantenMap.prototype.selectBackground = function(x,y){
	$(this.HTML_element+" #cel_"+x+"_"+y).addClass('selected');	
};

/**
 * It is called when the user clicked on the square of the map. It must be overriden
 * @memberOf XantenMap.prototype
 * @private
 */
XantenMap.prototype.selectCell = function(x, y){
	alert('The selectCell method for '+this.name+' map must be overriden.');
};

/**
 * It creates the table for the map and it links the listeners for the squares. It is called ones
 * @memberOf XantenMap.prototype
 */
XantenMap.prototype.init = function(){	
	
	var instance = this;	// save a reference for lambda functions
	var table    = '';
	var div 	 = '';
	
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
		instance._selectCell(elements[0], elements[1]);
	});	
	if(this._init){
		this._init();
	}	
	this.render();
};


/**
 * It is called when the map is selected. It calls the render and shows the map
 * @memberOf XantenMap.prototype
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
 * It is called when the map is hidden. It calls the deselect method and then hides the map
 * @memberOf XantenMap.prototype
 */
XantenMap.prototype.hide = function(){
	this.deselect();
	$(this.HTML_element).hide();
	if(this._hide){
		this._hide();
	}
};

/**
 * It saves the selected cell and calls selectCell method
 * @memberOf XantenMap.prototype
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 */
XantenMap.prototype._selectCell = function(x, y){
	this.deselect();
	this.selectCell(x, y);
	this.selectedCell = {"x": x, "y": y};
}

/**
 * It changes the map backgrounds and images.
 * @memberOf XantenMap.prototype
 */
XantenMap.prototype.update = function(){	
	var s = this.selectedCell;
	this.render();
	if(s) {
		this._selectCell(parseInt(s.x), parseInt(s.y));
	}
};

/**
 * It changes the map backgrounds and images.
 * @memberOf XantenMap.prototype
 */
XantenMap.prototype.render = function(){
	alert('The render method for '+this.name+' map must be overriden.');
};