/**
 * Functions for starting or joining a game
 * @author Cristian Sima & George Salter
 */
 
var thread_games,
	thread_users;
 
$(document).ready(function() {

	function get_update_game() {
		request = $.ajax({
			url: "/game/"+$("#game_token").val()+"",
			type: "GET"
		}).done(function (response) {		
			console.log(response);
			if(response["status"] === 'running'){
				clearTimeout(thread_users);
				$("#cover").fadeIn(1000,function() {
					document.location= '/game';
				});								
			} else {		
				var text = "";
				if(response.users){
					text = "<tr><td>Name of the users who have joined your game. Total (" + response.users.length + ")</td></tr>";			
					for (var i = 0; i < response.users.length; i++) {
						var user = response.users[i];
						text += "<tr><td>"+user+"</td></tr>";
					}							
					text = "<table class='table' id='table_users'>"+text+"</table>";
				}				
				$("#joined_users").hide();
				$("#joined_users").html(text);
				$("#joined_users").fadeIn();
			}
		});
	}
	
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
	
	function join_game(){
		$("#bottom").hide();
		clearInterval(thread_users);
		$("#available_games").html();
		$("#create_game").hide();
		$("#join_game").show(500);
		thread_games = setInterval(get_games, 2000);
		get_games();
	}
	
	function create_game(){			
		$("#bottom").hide();
		clearInterval(thread_games);
		$("#create_game").closest('form').find("input[type=text], textarea").val("");
		$("#join_game").hide();
		$("#start_game").hide();
		$("#create_game").show(500, function(){
			$("#game_user").focus();
		window.scrollTo(0,170);		
		generate_general_map();
		});
	}
	
	function waiting_players(response){
		$.cookie('session', response['session']);
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
	
	function join_game_now(token){	
		console.log('token: '+token);
		if(!token){
			return;
		}
		var name = prompt("Please enter your name to continue...", "")
		if (name !== null) {			
		clearInterval(thread_games);
		request = $.ajax({
				url: "/game/"+token+"/join",
				type: "PUT",
				data: {"user":name},
				success: function (response){
					if(response['status'] === "ERROR"){
						alert(response['message']);
						thread_games = setInterval(get_games, 2000);
					}
					else {
						$("#game_start").hide();
						$("#map_div").hide();
						$("#join_game").hide();
						$("#start_game").hide();
						$("#create_game").show(500, function(){
							waiting_players(response);					
						})
					}
				}
			})
		}
	}
	

   function get_games(){
		// get the available games
		request = $.ajax({
				url: "/game/",
				type: "GET"
			}).done(function (response){	
				var text = "";
				if(response.games){
					text = "<tr><td>Name of the game</td><td>Number of players</td><td>Join</td></tr>";			
					for (var i = 0; i < response.games.length; i++) {
						var game = response.games[i];
						text += "<tr><td>"+game.name+"</td><td>"+game.nrOfPlayers+"</td><td><input type='button' class='join_game_now bt' value='Join' token='"+game.token+"'  /> </td></tr>";
					}			
					text = "<table class='table'>"+text+"</table>";
				}
				$("#available_games").html(text);	
				$(".join_game_now").click(function(){
					join_game_now($(this).attr("token"));
				});
			});		
	}
	
	$('#game_create').click(function(){
		$("#game_create").attr("disabled", "disabled");
		$("#game_create").val("Your world is almost ready...");
		request = $.ajax({
			url: "/game/",
			type: "PUT",
			data: $('[name=game_create_form]').serialize(),
			success: function (response){
				waiting_players(response);
			}
		});
	});
	
	$("#join_button").click(function(){
		join_game();
	});
	
	$("#create_button").click(function(){
		create_game();
	});
	
	$("#generate_map").click(function(){
		generate_general_map($("#map_size").val());
	});
	
	$("#map_size").change(function(){
		generate_general_map($(this).val());
	});
	
	$("#connect_private_game").click(function(){
		join_game_now($("#private_token").val());
	});
	
	$("#game_start").click(function(){
		$(this).val("The game is loading...");
		$(this).attr("disabled", "disabled");
		request = $.ajax({
			url: "/game/"+$.cookie("token")+"/start",
			type: "PUT"
		});
	});
});