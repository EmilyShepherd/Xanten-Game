/**
 * The bord object represents a HTML div where there is added content
 * @constructor
 * @param {string} id The id of the board. It can be 'actions', 'news' or 'tasks'
 */
function Board(id){
	this.id = id;
}

/**
 * It adds a message to the board
 * @memberOf Board.prototype
 * @param {string} message The string to be added
 */
Board.prototype.add = function(message){
	var div = $("<div style='display:none'>"+message+"</div>");
	$("#"+this.id+"_board").prepend(div);
	div.fadeIn(500);
};

/**
 * It clears the board
 * @memberOf Board.prototype
 */
Board.prototype.clear = function(){
	var divs 	= $("#"+this.id+"_board").find("div"),
      f			=  function(t) { $(t).remove(); };
	for(var i=0; i<divs.length; i++){
		var div = divs[i];
		$(div).fadeOut(i*10, f(this));	
	}
};