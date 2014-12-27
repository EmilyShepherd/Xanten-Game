/**
 * Represents the view object which updates information
 *
 * @author Cristian Sima
 * @version 30.12.2014
 */

function Window(){
	this.actionsBoard      = new Board("actions");
	this.newsBoard         = new Board("news");
	this.currentTasksBoard = new Board("tasks");
}


Window.init = function() {	
	window.scrollTo(0, 0);
	console.log('here')
	$(window).resize(Window.render);	
	$("#map-view").buttonset();
	$('#map-view :radio').change(function() {
		game.selectMap(game[$('#map-view :radio:checked').val() + "Map"]);
	});
	Window.update();
}

/**
 * It updates the resources (gold, stone, wood, food)
 */
Window.updateResources = function(){
	$("#resources #stone").html(HTML_Engine.shortResourceRepresentation(game.player.resources.stone));
	$("#resources #wood").html(HTML_Engine.shortResourceRepresentation(game.player.resources.wood));
	$("#resources #food").html(HTML_Engine.shortResourceRepresentation(game.player.resources.food));
};

/**
 * It updates the number of people
 */
Window.updateStatistics = function() {
	$("#resources #people").html(HTML_Engine.shortResourceRepresentation(this.getAllPeopleOfCity()));
	$("#resources #gold").html(HTML_Engine.shortResourceRepresentation(game.player.resources.gold));
};

/**
 * It updates the details of the city (name, level, type of city)
 */
Window.updateDetailsCity = function() {
	$("#city_details #name").html(game.worldMap.data.cities[game.player.id].name);
	$("#city_details #level").html("Level: "+game.player.level);
	$("#city_details #type").html(game.getOrganizationInformationByLevel("name", game.player.level) );
};

/**
 * It updates the width and height for all boards, windows
 */
Window.update = function() {
	$("#actions_board").css({"height":1+"px", "min-height": 1+"px"});
	$("#news_board").css({"height":1+"px", "min-height": 1+"px"});
	$("#tasks_board").css({"height":1+"px", "min-height": 1+"px"});
	
	var height = $(document).height();
	
	var heightForOneBoard = height-245;
	var heightForTwoBoards = (height-(105+135*2))/2;
	
	$("#actions_board").css({"height":heightForOneBoard+"px", "min-height": heightForOneBoard+"px"});
	$("#news_board").css({"height":heightForTwoBoards+"px", "min-height": heightForTwoBoards+"px"});
	$("#tasks_board").css({"height":heightForTwoBoards+"px", "min-height": heightForTwoBoards+"px"});
}