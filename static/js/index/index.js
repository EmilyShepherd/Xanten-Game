/**
 * Functions for starting or joining a game
 * @author Cristian Sima & George Salver
 */
 
var thread_games,
	thread_users;
 
$(document).ready(function() {

	function get_users(){
		request = $.ajax({
			url: "python/get_users.py",
			type: "post",
			data: {"token": $("#game_token").val()}
		}).done(function (response){		
			$("#joined_users").html(""+ response);	
		});
	}
	
	function generate_general_map(){	
		$("#map_image").fadeOut(300, function(){		
			var map_values = generateGeneralMap();
			$("#game_map").val(map_values); 
			$("#map_image").html(generateHTMLMap(map_values));			
			$("#map_image").fadeIn(300, function(){	
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
		window.scrollTo(0,220);		
		generate_general_map();
		});

	}
	
	function waiting_players(response){
		 eval("var response ="+response);
		document.cookie="game_session="+response['session']+"; expires=Thu, 18 Dec 2017 12:00:00 UTC";
		document.cookie="game_token="+response['token']+"; expires=Thu, 18 Dec 2017 12:00:00 UTC";
		$("#game_token").val(response['token']);	   		
		$("#available_users").show();
		$("#create_game_form").hide();
		$("#start_game").show();
		$("#generate_map").hide();
		thread_users = setInterval(get_users, 2000);	
		get_users();
	}
	
	function join_game_now(token){	
		var name = prompt("Please enter your name to continue...", "")
		if (name !== null) {			
		clearInterval(thread_games);
		request = $.ajax({
			url: "python/join_game.py",
				type: "POST",
				data: {"token":token, "user":name},
				success: function (response){
					if(response === "false"){
						alert('There was a problem with the connection. Impossible to do this.');
						document.location='./';
					}
					else {
						// set cookie
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
			url: "python/get_games.py",
			type: "GET"
		}).done(function (response){		
			$("#available_games").html(""+ response);	
			
			// process them
			$(".join_game_now").click(function(){
				join_game_now($(this).attr("token"));
			});
		});
		
	}
	
	$('#game_create').click(function(){
		$("#create_game_form").show();
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
		generate_general_map();
	});
	
	$("#connect_private_game").click(function(){
		join_game_now($("#private_token").val());
	});
	
	$("#game_start").click(function(){
		$(this).val("The game is loading...");
		$(this).attr("disabled", "disabled");
		request = $.ajax({
			url: "python/start_game.py",
			type: "POST"
		});
	});
});