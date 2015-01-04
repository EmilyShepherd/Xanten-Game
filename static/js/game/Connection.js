/**
 * @file It has functions for creating or joining a game
 * @author Cristian Sima
 * @version 3.1.2015
 */


/**
 *  It has functions for creating or joining a game
 *  @constructor
 *  @property {reference} threadGames It represents the thread for receiving the available games
 *  @property {reference} threadUsers It represents the thread for receiving the available players for a given game
 */
function Connection() {
  
	if(game) {
		return null;
	}


	$('#game_create').click(function() {
		$("#game_create").attr("disabled", "disabled");
		$("#game_create").val("Your world is almost ready...");
		$.ajax({
			url: "/game/",
			type: "PUT",
			data: $('[name=game_create_form]').serialize(),
			success: function (response) {
				connection.waitingPlayers(response);
			}
		});
	});

	$("#join_button").click(function() {
		connection.joinGame();
	});

	$("#create_button").click(function() {
		connection.createGame();
	});

	$("#generate_map").click(function() {
		connection.generateGeneralMap($("#map_size").val());
	});

	$("#map_size").change(function() {
		connection.generateGeneralMap($(this).val());
	});

	$("#connect_private_game").click(function() {
		connection.joinGameNow($("#private_token").val());
	});

	$("#game_start").click(function() {
		$(this).val("The game is loading...");
		$(this).attr("disabled", "disabled");
		$.ajax({
			url: "/game/"+$.cookie("token")+"/start",
			type: "PUT"
		}).done(function(response)
				{
					if (response.status === 'started')
					{
						$("#cover").fadeIn(1000, function(){
							connection.startGame(response);
						});
					}
				});
	});

	if(DEVELOPER_MODE === true && developer.settings.loadDeveloperGame) {
		this.startGame(developer.game);
		$("#before_game").hide();
		$("#cover").hide();
		$("#game").show();
	}
}

/**
 * It loads the necesarry javascript and css resources and then it starts the game by creating a new game.
 * @param {object} response The object which contain information regarding the game.
 * @memberOf Connection.prototype
 */
Connection.prototype.startGame = function(response) {



	clearTimeout(this.threadUsers);

	
	var path 		= "/static/js/game/",
		/**
		 * It loads a JavaScript file
		 * @inner
		 */
		loadJsFile 	= function(file) {
			var jsLink = $("<script type='text/javascript' src='" + file + "'>");
			$("head").append(jsLink); 
		},
		/**
		 * It loads the JavaScript objects for game
		 * @inner
		 */
		loadJS 		= function() {
			var files 		= [				      		  
				          		   path + "Game.js",
				          		   path + "City.js",
				          		   path + "Board.js",
				          		   path + "Resources.js",
				          		   path + "Window.js",
				          		   path + "Action.js",
				          		   path + "XantenMap.js",
				          		   path + "CityMap.js",
				          		   path + "WorldMap.js",
				          		   path + "HTML_Engine.js",
				          		   path + "ProgressBar.js",
				          		   path + "Task.js",
				          		   path + "RealTimeEngine.js",
				          		   path + "Player.js"
			          		   ],		
			          		   promises 	= $.map(files, loadJsFile);
			$.when.apply($, promises).then(function() {
				createGame();
			});
		},
		/**
		 * It creates the cityMap, worldMap, player and game objects. Then it calls the game.init() method
		 * @inner
		 */
		createGame	= function(){
			var	cityMap  	= new CityMap(response.game.maps.city),
				worldMap 	= new WorldMap(response.game.maps.world),
				player		= new Player(response.player);
		
			/*
			 * It creates the game
			 */
			game 		= new Game(response.game.data, player, cityMap, worldMap, response.game.tasks);
	
			/*
			 * Loads the libraries
			 */
			var files = [
			             path + "game.constructions.js",
			             path + "game.organization.js",
			             path + "game.unit.js",
			             path + "game.actions.js",
			             path + "game.tasks.js"],
			   promises 	= $.map(files, loadJsFile);
				$.when.apply($, promises).then(function() {
					game.init();
				});
		};

	$("#before_game").hide();
	$('#game').show();
	$('body').removeAttr('style');

	// Remove old stylesheet
	$("#style").remove();

	// Include new stylesheet
	var inc    = document.createElement('link');
	inc.rel    = 'stylesheet';  
	inc.href   = '/static/css/gamestyle.css';
	inc.onload = loadJS;

	document.head.appendChild(inc);
};

/**
 * It gets the last updates (users, status) of the game. If the game is started, it sents the user to /game
 * @memberOf Connection.prototype
 */
Connection.prototype.getUpdateGame = function() {
 $.ajax({
		url: "/game/"+$("#game_token").val()+"",
		type: "GET"
	}).done(
			/**
			 * It returns the status of the game
			 * @param {object} respose It has: reponse.status (could be running or started) and repsonse.users which holds information regarding the users for the game
			 */
			function (response) {	
				if(response.status === 'running')
				{	
					$("#cover").fadeIn(1000, function(){
						connection.startGame(response);
					});
				} else {		
					var text = "";
					if(response.users) {
						text = "<tr><td>Name of the users who have joined your game. Total (" + response.users.length + ")</td></tr>";			
						for (var i = 0; i < response.users.length; i++) {
							var user = response.users[i];
							text += "<tr><td>"+user+"</td></tr>";
						}							
						text = "<table class='table' id='table_users'>"+text+"</table>";
					}				
					$("#joined_users").html(text);
				}
			});
};

/**
 * It generates an displays a new random map for the world. Also, it stores it in a variable and focus the field "name of user"
 * @param {string} size The size of the map. It can be: small, medium, large
 * @memberOf Connection.prototype
 */
Connection.prototype.generateGeneralMap = function(size) {	
	$("#map_image").fadeOut(300, function() {		
		var map_values = connection.generateAbstractGeneralMap(size);
		$("#game_map").val(map_values); 
		$("#map_image").html(connection.generateHTMLMap(map_values));			
		$("#map_image").fadeIn(300, function() {	
			$("#game_user").focus();
		});		
	});
};

/**
 * It displays the div with the public games which are available
 * @memberOf Connection.prototype
 */
Connection.prototype.joinGame = function() {
	$("#bottom").hide();
	clearInterval(this.threadUsers);
	$("#available_games").html();
	$("#create_game").hide();
	$('body').css('background-image','none');
	$("#join_game").show(500);
	this.threadGames = setInterval(this.getGames, 2000);
	this.getGames();
};

/**
 * It displays the form to create a new game (with the random medium map)
 * @memberOf Connection.prototype
 */
Connection.prototype.createGame = function() {			
	$("#bottom").hide();
	clearInterval(this.threadGames);
	$("#create_game").closest('form').find("input[type=text], textarea").val("");
	$("#join_game").hide();
	$("#start_game").hide();
	$('body').css('background-image','none');
	$("#create_game").show(500, function() {
		$("#game_user").focus();
		window.scrollTo(0,170);		
		connection.generateGeneralMap('medium');
	});
};

/**
 * It saves the session and token of the user and sets an interval for getting the last updates of the game
 * @param {object} response The object from database which contain the information to identify the user and the game
 * @memberOf Connection.prototype
 */
Connection.prototype.waitingPlayers = function(response) {
	$.cookie('token', response.token);
	$("#game_token").val(response.token);
	$("#start_game").show();	   		
	$("#available_users").slideDown(500);
	$("#create_game_form").hide();
	$("#generate_map").hide();
	$("#map_size").hide();
	this.threadUsers = setInterval(connection.getUpdateGame, 2000);	
	this.getUpdateGame();
};

/**
 * It helps a user to join a game based on the token. If there are problems it displays a message
 * @param {string} token The token of the game
 * @memberOf Connection.prototype
 */
Connection.prototype.joinGameNow = function(token) {	
	if (!token) {
		return;
	}
	var name = prompt("Choose your name in the game...", "");
	name = (name)?name:"";
	clearInterval(this.threadGames);
	$.ajax({
		url: "/game/"+token+"/join",
		type: "PUT",
		data: {"username":name},
		success: function (response) {
			if(response.status === "error") {
				alert(response.message);
				connection.threadGames = setInterval(connection.getGames, 2000);
			}
			else {
				$("#game_start").hide();
				$("#map_div").hide();
				$("#join_game").hide();
				$("#start_game").hide();
				$("#create_game").show(500, function() {
					connection.waitingPlayers(response);					
				});
			}
		}
	});
};	

/**
 * It gets all the public non-started games and displays them
 * @memberOf Connection.prototype
 */
Connection.prototype.getGames = function(){
	$.ajax({
		url: "/game/",
		type: "GET"
	}).done(function (response) {	
		var text = "";
		if (response.games) {
			text = "<tr><td>Name of the game</td><td>Number of players</td><td>Join</td></tr>";			
			for (var i=0; i < response.games.length; i++) {
				var game = response.games[i];
				text += "<tr><td>"+game.name+"</td><td>"+game.nrOfPlayers+"</td><td><input type='button' class='join_game_now bt' value='Join' token='"+game.token+"'  /> </td></tr>";
			}			
			text = "<table class='table'>"+text+"</table>";
		}
		$("#available_games").html(text);	
		$(".join_game_now").click(function() {
			this.joinGameNow($(this).attr("token"));
		});
	});		
};

/**
 *  It generates and returns a random map for the world
 *
 * @param {string} size The size of the map (small, medium, large)
 * @returns {array} The world map
 * @author Joe
 * @memberOf Connection.prototype
 *
 */
Connection.prototype.generateAbstractGeneralMap = function(size){

	var imgArray = [[], [], [], [], [], [], []],

	/**
	 *  Checks the value of a space in the map array, returning the empty string for co-ordinates that don't exist.
	 * (This avoids nasty array index errors when we get close to the edges.)
	 * @inner
	 * @param {string} y_coord The y co-ordonate
	 * @param {string}x_coord The x co-ordonate
	 * @returns {boolean}
	 * @author Joe
	 */
	check = function(y_coord, x_coord) {
		if (x_coord < 0 || y_coord < 0 || x_coord > 6 || y_coord > 6) {
			return "";
		} else {
			return imgArray[y_coord][x_coord];
		}
	};


	// Controlling amount of space on the map.
	var minClear = 0,
		noClear = 49;
	
	switch (size) {
		// Small: 2-4 players
		// Medium: 4-6 players
		// Large: 6-10 players
		case "small":
			minClear = 8;
			break;
		case "large":
			minClear = 20;
			break;
		default:
			minClear = 12;
		}

	// Variables which control properties of the world being generated:
	// How often do things appear?
	var OCEAN_SEED = Math.floor((Math.random() * 9) + 1)/100, // 0.01 ---> 0.09
	 	ROCK_SEED = 0.01,
	 	FOREST_SEED = 0.1,
	// What's the likelihood that they'll spread?
	 	OCEAN_EXPAND = Math.floor((Math.random() * 9) + 3)/100, // 0.03 --> 0.09
	 	FOREST_EXPAND = Math.floor((Math.random() * 9) + 5)/100, // 0.05 --> 0.09
	// Calculating probabilities:
	 	p_ocean = 1 - OCEAN_SEED,

		 x = 0,
		 y = 0,
		 r = 0;
	
	while (y < 7) {
		while (x < 7) {
			r = Math.random();
			if ((r > p_ocean) && (noClear > minClear)) {
				imgArray[y][x] = "o";
				noClear--;
			} else {
				imgArray[y][x] = "g";
			}
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (noClear > minClear) {
				if (imgArray[y][x] === "o") {
					if (x > 0) {
						if (Math.random() < OCEAN_EXPAND) {
							imgArray[y][x - 1] = "o";
							noClear--;
						}
					}
					if (x < 6) {
							if (Math.random() < OCEAN_EXPAND) {
							imgArray[y][x + 1] = "o";
							noClear--;
						}
					}
					if (y > 0) {
						if (Math.random() < OCEAN_EXPAND) {
							imgArray[y - 1][x] = "o";
							noClear--;
						}
					}
					if (y < 6) {
						if (Math.random() < OCEAN_EXPAND) {
							imgArray[y + 1][x] = "o";
							noClear--;
						}
					}
				}
			}
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "g") {
				if (check(y+1, x) === "o") {
					if (check(y-1, x) === "o") {
						imgArray[y][x] = "o";
					} else {
						imgArray[y][x] = "o-s";
					}
				}
				if (check(y-1, x) === "o") {
					if (check(y+1, x) === "o") {
						imgArray[y][x] = "o";
					} else {
						imgArray[y][x] = "o-n";
					}
				}
				if (check(y, x+1) === "o") {
					if (check(y, x-1) === "o") {
						imgArray[y][x] = "o";
					} else {
						imgArray[y][x] = "o-e";
					}
				}
				if (check(y, x-1) === "o") {
					if (check(y, x+1) === "o") {
						imgArray[y][x] = "o";
					} else {
						imgArray[y][x] = "o-w";
					}
				}
			}
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "g") {
				if (check(y+1, x) === "o-e" && check(y, x+1) === "o-s") imgArray[y][x] = "oc-se";
				if (check(y+1, x) === "o-w" && check(y, x-1) === "o-s") imgArray[y][x] = "oc-sw";
				if (check(y-1, x) === "o-e" && check(y, x+1) === "o-n") imgArray[y][x] = "oc-ne";
				if (check(y-1, x) === "o-w" && check(y, x-1) === "o-n") imgArray[y][x] = "oc-nw";
			}
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "o-e") {
				if (check(y, x-1) === "o-n") imgArray[y][x] = "ob-ne";
				if (check(y, x-1) === "o-s") imgArray[y][x] = "ob-se";
			}
			if (check(y, x) === "o-w") {
				if (check(y, x+1) === "o-n") imgArray[y][x] = "ob-nw";
				if (check(y, x+1) === "o-s") imgArray[y][x] = "ob-sw";
			}
			if (check(y, x) === "o-s") {
				if (check(y-1, x) === "o-e") imgArray[y][x] = "ob-se";
				if (check(y-1, x) === "o-w") imgArray[y][x] = "ob-sw";
			}
			if (check(y, x) === "o-n") {
				if (check(y+1, x) === "o-e") imgArray[y][x] = "ob-ne";
				if (check(y+1, x) === "o-w") imgArray[y][x] = "ob-nw";
			}
			x++;
		}
		x = 0;
		y++;
	}

	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "g") {
				if (check(y-1, x) === "o-e" && check(y, x+1) === "o-e") {
					imgArray[y][x] = "oc-ne";
					imgArray[y][x+1] = "ob-ne";
				}
				if (check(y-1, x) === "o-w" && check(y, x-1) === "o-w") {
					imgArray[y][x] = "oc-nw";
					imgArray[y][x-1] = "ob-nw";
				}
				if (check(y+1, x) === "o-e" && check(y, x+1) === "o-e") {
					imgArray[y][x] = "oc-se";
					imgArray[y][x+1] = "ob-se";
				}
				if (check(y+1, x) === "o-w" && check(y, x-1) === "o-w") {
					imgArray[y][x] = "oc-sw";
					imgArray[y][x-1] = "ob-sw";
				}
			}
			x++;
		}
		x = 0;
		y++;
	}

	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "o-w") {
				if (check(y+1, x) === "o") imgArray[y][x] = "ob-sw";
				if (check(y-1, x) === "o") imgArray[y][x] = "ob-nw";
			}
			if (check(y, x) === "o-e") {
				if (check(y+1, x) === "o") imgArray[y][x] = "ob-se";
				if (check(y-1, x) === "o") imgArray[y][x] = "ob-ne";
			}
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "ob-nw" && check(y, x+1) === "ob-nw") imgArray[y][x] = "o";
			if (check(y, x) === "ob-ne" && check(y, x-1) === "ob-ne") imgArray[y][x] = "o";
			if (check(y-1, x) === "ob-ne" && check(y, x+1) === "ob-ne") imgArray[y][x] = "oc-ne";
			if (check(y-1, x) === "ob-nw" && check(y, x-1) === "ob-nw") imgArray[y][x] = "oc-nw";
			if (check(y+1, x) === "ob-se" && check(y, x+1) === "ob-se") imgArray[y][x] = "oc-se";
			if (check(y+1, x) === "ob-sw" && check(y, x-1) === "ob-sw") imgArray[y][x] = "oc-sw";
			if (check(y,x) === "o-w" && check(y, x+1) === "ob-se") imgArray[y][x] = "ob-sw";
			if (check(y,x) === "o-w" && check(y, x+1) === "ob-ne") imgArray[y][x] = "ob-nw";
			if (check(y,x) === "o-e" && check(y, x-1) === "ob-nw") imgArray[y][x] = "ob-ne";
			if (check(y,x) === "o-e" && check(y, x-1) === "ob-sw") imgArray[y][x] = "ob-se";
			if (check(y,x) === "o-n" && check(y+1, x) === "ob-se") imgArray[y][x] = "ob-ne";
			if (check(y,x) === "o-n" && check(y+1, x) === "ob-sw") imgArray[y][x] = "ob-nw";
			if (check(y,x) === "o-s" && check(y-1, x) === "ob-ne") imgArray[y][x] = "ob-sw";
			if (check(y,x) === "o-s" && check(y-1, x) === "ob-nw") imgArray[y][x] = "ob-se";
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "ob-sw") {
				if (check(y-1, x) === "o" || check(y-1, x) === "ob-sw" || check(y-1, x) === "ob-se" || check(y-1, x) === "o-s" || check(y, x+1) === "o" || check(y, x+1) === "ob-sw" || check(y, x+1) === "ob-nw" || check(y, x+1) === "o-w") {
					imgArray[y][x] = "o";
				}
			}
			if (check(y, x) === "ob-nw") {
				if (check(y+1, x) === "o" || check(y+1, x) === "ob-nw" || check(y+1, x) === "ob-ne" || check(y+1, x) === "o-n" || check(y, x+1) === "o" || check(y, x+1) === "ob-nw" || check(y, x+1) === "ob-sw" || check(y, x+1) === "o-w") {
					imgArray[y][x] = "o";
				}
			}
			if (check(y, x) === "ob-se") {
				if (check(y-1, x) === "o" || check(y-1, x) === "ob-sw" || check(y-1, x) === "ob-se" || check(y-1, x) === "o-s" || check(y, x-1) === "o" || check(y, x-1) === "ob-se" || check(y, x-1) === "ob-ne" || check(y, x-1) === "o-e") {
					imgArray[y][x] = "o";
				}
			}
			if (check(y, x) === "ob-ne") {
				if (check(y+1, x) === "o" || check(y+1, x) === "ob-nw" || check(y+1, x) === "ob-ne" || check(y+1, x) === "o-n" || check(y, x-1) === "o" || check(y, x-1) === "ob-ne" || check(y, x-1) === "ob-se" || check(y, x-1) === "o-e") {
					imgArray[y][x] = "o";
				}
			}
			x++;
		}
		x = 0;
		y++;
	}
	// Straight borders
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x-1) === "o-s" && check(y, x+1) === "o-s") imgArray[y][x] = "o-s";
			if (check(y, x-1) === "o-n" && check(y, x+1) === "o-n") imgArray[y][x] = "o-n";
			if (check(y-1, x) === "o-e" && check(y+1, x) === "o-e") imgArray[y][x] = "o-e";
			if (check(y-1, x) === "o-w" && check(y+1, x) === "o-w") imgArray[y][x] = "o-w";
			if (check(y, x) === "g" || check(y, x) === "g") {
				if (check(y-1, x) === "o-e" && check(y, x-1) === "o-s") imgArray[y][x] = "ob-se";
				if (check(y-1, x) === "o-e" && check(y, x+1) === "o-n") imgArray[y][x] = "ob-ne";
				if (check(y+1, x) === "o-w" && check(y, x-1) === "o-s") imgArray[y][x] = "ob-sw";
				if (check(y+1, x) === "o-w" && check(y, x+1) === "o-n") imgArray[y][x] = "ob-nw";
			}
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "g") {
				if (check(y+1, x) === "o") {
					if (check(y-1, x) === "o") {
						imgArray[y][x] = "o";
					} else {
						imgArray[y][x] = "o-s";
					}
				}
				if (check(y-1, x) === "o") imgArray[y][x] = "o-n";
				if (check(y, x+1) === "o") {
					if (check(y, x-1) === "o") {
						imgArray[y][x] = "o";
					} else {
						imgArray[y][x] = "o-e";
					}
				}
				if (check(y, x-1) === "o") imgArray[y][x] = "o-w";
			}
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "oc-ne") {
				if (check(y, x-1) === "o-s") imgArray[y][x] = "oa-ne";
				if (check(y+1, x) === "o-w") imgArray[y][x] = "oa-ne";
			}
			if (check(y, x) === "oc-nw") {
				if (check(y, x+1) === "o-s") imgArray[y][x] = "oa-nw";
				if (check(y+1, x) === "o-e") imgArray[y][x] = "oa-nw";
			}
			if (check(y, x) === "oc-se") {
				if (check(y, x-1) === "o-n") imgArray[y][x] = "oa-ne";
				if (check(y-1, x) === "o-e") imgArray[y][x] = "oa-ne";
			}
			if (check(y, x) === "oc-sw") {
				if (check(y, x+1) === "o-n") imgArray[y][x] = "oa-nw";
				if (check(y-1, x) === "o-w") imgArray[y][x] = "oa-nw";
			}
			if (check(y, x) === "o") {
				if (check(y-1, x) === "ob-nw" && check(y, x+1) === "oc-sw") imgArray[y][x] = "ob-sw";
				if (check(y+1, x) === "ob-sw" && check(y, x+1) === "oc-nw") imgArray[y][x] = "ob-nw";
				if (check(y-1, x) === "ob-ne" && check(y, x-1) === "oc-se") imgArray[y][x] = "ob-se";
				if (check(y+1, x) === "ob-se" && check(y, x-1) === "oc-ne") imgArray[y][x] = "ob-ne";
			}
			if (check(y, x) === "g") {
				r = Math.random();
				if (r < FOREST_SEED/2) {
					imgArray[y][x] = "t0";
				} else if (r < FOREST_SEED) {
					imgArray[y][x] = "t1";
				}
			}
			x++;
		}
		x = 0;
		y++;
	}
	x = 0;
	y = 0;
	while (y < 7) {
		while (x < 7) {
			if (check(y, x) === "t0") {
				if (check(y-1,x) === "g" && Math.random() < FOREST_EXPAND) imgArray[y-1][x] = "t1";
				if (check(y+1,x) === "g" && Math.random() < FOREST_EXPAND) imgArray[y+1][x] = "t1";
				if (check(y,x-1) === "g" && Math.random() < FOREST_EXPAND) imgArray[y][x-1] = "t1";
				if (check(y,x+1) === "g" && Math.random() < FOREST_EXPAND) imgArray[y][x+1] = "t1";
			}
			if (check(y, x) === "g" && Math.random() < ROCK_SEED) imgArray[y][x] = "m".concat(Math.round(Math.random()));
			x++;
		}
		x = 0;
		y++;
	}
	return imgArray;
};

/**
 *  It returns the html representation of the map
 *	@param imgArray {array} An array with the map
 *  @returns {string} A string representing the HTML map
 *  @author Joe and Cristian
 *  @memberOf Connection.prototype
 */
Connection.prototype.generateHTMLMap = function(imgArray) {
	var x = 0,
		y = 0,
		size = imgArray.length,
		map = "  <div class='map' border='0' cellspacing='0'>";

	while (y < size) {
		map += "<div class='row'>";
		while (x < size) {
			map += "<div style=\"background-image: url('static/img/map/general/"+ imgArray[y][x]+ ".png');\"></div>";
			x++;
		}
		if (y < size-1) {
			map += "</div><div>";
		}
		x = 0;
		y++;
		map += "</div>";
	}
	map += "</div>";
	return map;
};