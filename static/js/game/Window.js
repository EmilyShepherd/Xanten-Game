/**
 * @file Represents the view object which updates information
 * @author Cristian Sima
 * @version 30.12.2014
 */
/**
 * It represents the view object which updates information
 * @constructor
 */
function Window() {}

/**
 * A reference to the bord for actions
 * @memberOf Window
 */
Window.actionsBoard = new Board("actions");

/**
 * A reference to the board for news
 * @memberOf Window
 */
Window.newsBoard = new Board("news");

/**
 * A reference to the board for tasks
 * @memberOf Window
 */
Window.currentTasksBoard = new Board("tasks");

/**
 * It scrools the window to top, it renders the game and sets a listener for changing the map buttons
 * @memberOf Window
 */
Window.init = function() {
	window.scrollTo(0, 0);
	$(window).resize(Window.render);
	$("#map-view").buttonset();
	$('#map-view :radio').change(function() {
		game.selectMap(game[$('#map-view :radio:checked').val() + "Map"]);
	});
	$("#news_clear").click(function() {
		Window.newsBoard.clear();
	}); 
	$("#see_messages").click(function(){
		game.performAction('messages');
	})
	Window.update();
	Window.refresh();
};

/**
 * It updates the details of city, resources, statistics
 * @memberOf Window
 */
Window.refresh = function() {
	Window.updateDetailsCity();
	Window.updateResources();
	Window.updateStatistics();
};

/**
 * It updates the resources (gold, stone, wood, food)
 * @memberOf Window
 */
Window.updateResources = function() {
	$("#resources #stone").html(HTML_Engine.shortResourceRepresentation(game.player.resources.stone));
	$("#resources #wood").html(HTML_Engine.shortResourceRepresentation(game.player.resources.wood));
	$("#resources #food").html(HTML_Engine.shortResourceRepresentation(game.player.resources.food));
};

/**
 * It updates the number of people
 * @memberOf Window
 */
Window.updateStatistics = function() {
	$("#resources #people").html(HTML_Engine.shortResourceRepresentation(game.player.city.getNumberOfPeople()));
	$("#resources #gold").html(HTML_Engine.shortResourceRepresentation(game.player.resources.gold));
};

/**
 * It updates the details of the city (name, level, type of city)
 * @memberOf Window
 */
Window.updateDetailsCity = function() {
	$("#city_details #name").html(game.player.name);
	$("#city_details #level").html("Level: " + game.player.getLevel());
	$("#city_details #type").html(game.organization.getByLevel("name", game.player.getLevel()));
};

/**
 * It updates the width and height for all boards, windows
 * @memberOf Window
 */
Window.update = function() {
	$("#actions_board").css({
		"height": 1 + "px",
		"min-height": 1 + "px"
	});
	$("#news_board").css({
		"height": 1 + "px",
		"min-height": 1 + "px"
	});
	$("#tasks_board").css({
		"height": 1 + "px",
		"min-height": 1 + "px"
	});

	var height = $(document).height();

	var heightForOneBoard = height - 245;
	var heightForTwoBoards = (height - (105 + 135 * 2)) / 2;

	$("#actions_board").css({
		"height": heightForOneBoard + "px",
		"min-height": heightForOneBoard + "px"
	});
	$("#news_board").css({
		"height": heightForTwoBoards + "px",
		"min-height": heightForTwoBoards + "px"
	});
	$("#tasks_board").css({
		"height": heightForTwoBoards + "px",
		"min-height": heightForTwoBoards + "px"
	});
};