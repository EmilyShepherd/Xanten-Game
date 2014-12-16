/**
 * Functions for starting or joining a game
 *
 * @author Cristian Sima & George Salter
 * @version 21.11.2014
 */
 

var game = null;

var thread_games,
	thread_users;

/*
 * 
 * This starts a default game and enters the game without the create/join promt
 */
var settings = { 
		"developerMode": true			// avoid the connection and effects
	};
 
$(document).ready(function() {


	if(settings.developerMode === true){
		start_game({"status": "started", "token":"the token", 
			"maps" : {
			"city" : [
						[
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								}
							],
							[
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								}
							],
							[
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								}
							],
							[
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								}
							],
							[
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								}
							],
							[
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								}
							],
							[
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								},
								{
									"id_background": 1,
									"id_building": 1
								}
							]
					],
		"world":  {
					map:
					[
						[
								{
									"id_background": 1,
									"id_city": 1
								},
								{
									"id_background": 1,
									"id_city": 2
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								}
							],
							[
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								}
							],
							[
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								}
							],
							[
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								}
							],
							[
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								}
							],
							[
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								}
							],
							[
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								},
								{
									"id_background": 1,
									"id_city": null
								}
							]
					],
					cities: {
									1: {
										name: "Fantomous",
										player: "Aladin",
										level: "12"										
									},
									2: {										
										name: "Glacious",
										player: "Kanga",
										level: "11"
									}
								}
			}

		}
	
		, "player": {"id": 1, "resources": {"gold": 50.0, "stone": 200.0, "wood": 200.0, "food": 200.0}, "level": "Hamlet", "buildings": {"storage": {"level": 1, "num": 0}, "mine": {"level": 1, "num": 0, "people": 0}, "dock": {"level": 1, "num": 0, "people": 0}, "house": {"num": 1}, "trade": {"people": 0, "num": 0}, "military": {"people": 0, "num": 0, "level ": 1}, "lumberjack": {"level": 1, "num": 0, "people": 0}, "grapevine": {"people": 0, "num": 0}, "home": {"level": 1, "num": 1, "people": 50}}, "position": 13}});
		$("#before_game").hide();
		$("#cover").hide();
		$("#game").show();
	}
	
	/**
	 * It starts the game
	 * 
	 */
    function start_game(response)
    {
        clearTimeout(thread_users);

        //var scripts = ['index/Game.js', 'index/XantenMap.js', 'index/Board.js'];
        
      
        var after_file_loaded = function(){
        	
    		var cityMap  = new CityMap(response.maps.city);
    		var worldMap = new WorldMap(response.maps.world);
    		
    		game = new Game(response.token, response.player, cityMap, worldMap);
    		
    		// loads the game
    		game.init();
    		
            var value = ((settings.developerMode)?10:1000)
    		$("#cover").fadeOut(value, function()
    		{
    			// game is ready
    		});
        	
        }

        
        $("#before_game").hide();
        $('#game').show();

        // Remove old stylesheet
        $("#style").remove();
        
        // Include new stylesheet
        var inc    = document.createElement('link');
        inc.rel    = 'stylesheet';  
        inc.href   = '/static/css/gamestyle.css';
        inc.onload = after_file_loaded;
        
        document.head.appendChild(inc);


    }

	/**
	 * It gets the last updates (users, status) of the game. If the game is started, it sents the user to /game
	 */
	function get_update_game() {
		request = $.ajax({
			url: "/game/"+$("#game_token").val()+"",
			type: "GET"
		}).done(function (response) {	
			if(response["status"] === 'running')
            {	
				$("#cover").fadeIn(1000, function(){
					start_game(response);
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
	}
	
	/**
	 * It generates an displays a new random map for the world. Also, it stores it in a variable and focus the field "name of user"
	 * @param (word) size The size of the map. It can be: small, medium, large
	 */
	function generate_general_map(size) {	
		$("#map_image").fadeOut(300, function() {		
			var map_values = generateGeneralMap(size);
			$("#game_map").val(map_values); 
			$("#map_image").html(generateHTMLMap(map_values));			
			$("#map_image").fadeIn(300, function() {	
				$("#game_user").focus();
			});		
		});
	}
	
	/**
	  * It displays the div with the public games which are available
	  */
	function join_game() {
		$("#bottom").hide();
		clearInterval(thread_users);
		$("#available_games").html();
		$("#create_game").hide();
		$("#join_game").show(500);
		thread_games = setInterval(get_games, 2000);
		get_games();
	}
	
	/**
	 * It displays the form to create a new game (with the random medium map)
	 */
	function create_game() {			
		$("#bottom").hide();
		clearInterval(thread_games);
		$("#create_game").closest('form').find("input[type=text], textarea").val("");
		$("#join_game").hide();
		$("#start_game").hide();
		$("#create_game").show(500, function() {
			$("#game_user").focus();
		window.scrollTo(0,170);		
		generate_general_map('medium');
		});
	}
	
	/**
	 * It saves the session and token of the user and sets an interval for getting the last updates of the game
	 * @param (object) response The object from database which contain the information to identify the user and the game
	 */
	function waiting_players(response) {
		$.cookie('token', response['token']);
		$("#game_token").val(response['token']);
		$("#start_game").show();	   		
		$("#available_users").slideDown(500);
		$("#create_game_form").hide();
		$("#generate_map").hide();
		$("#map_size").hide();
		thread_users = setInterval(get_update_game, 2000);	
		get_update_game();
	}
	
	/**
	  * It helps a user to join a game based on the token. If there are problems it displays a message
	  * @param (string) token The token of the game
	  */
	function join_game_now(token) {	
		if (!token) {
			return;
		}
		var name = prompt("Choose your name in the game...", "");
		name = (name)?name:"";
		clearInterval(thread_games);
		request = $.ajax({
				url: "/game/"+token+"/join",
				type: "PUT",
				data: {"username":name},
				success: function (response) {
					if(response['status'] === "error") {
						alert(response['msg']);
						thread_games = setInterval(get_games, 2000);
					}
					else {
						$("#game_start").hide();
						$("#map_div").hide();
						$("#join_game").hide();
						$("#start_game").hide();
						$("#create_game").show(500, function() {
							waiting_players(response);					
						})
					}
				}
			})
	}	
	
	/**
	  * It gets all the public non-started games and displays them
	  */
   function get_games(){
		request = $.ajax({
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
					join_game_now($(this).attr("token"));
				});
			});		
	}
	
	$('#game_create').click(function() {
		$("#game_create").attr("disabled", "disabled");
		$("#game_create").val("Your world is almost ready...");
		request = $.ajax({
			url: "/game/",
			type: "PUT",
			data: $('[name=game_create_form]').serialize(),
			success: function (response) {
				waiting_players(response);
			}
		});
	});
	
	$("#join_button").click(function() {
		join_game();
	});
	
	$("#create_button").click(function() {
		create_game();
	});
	
	$("#generate_map").click(function() {
		generate_general_map($("#map_size").val());
	});
	
	$("#map_size").change(function() {
		generate_general_map($(this).val());
	});
	
	$("#connect_private_game").click(function() {
		join_game_now($("#private_token").val());
	});
	
	$("#game_start").click(function() {
		$(this).val("The game is loading...");
		$(this).attr("disabled", "disabled");
		request = $.ajax({
			url: "/game/"+$.cookie("token")+"/start",
			type: "PUT"
		}).done(function(response)
        {
            if (response['status'] == 'started')
            {
            	$("#cover").fadeIn(1000, function(){
            		start_game(response);
            	});
            }
        })
	});
});