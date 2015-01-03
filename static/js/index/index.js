/**
 * Functions for starting and joining the game.
 * @file 
 * @author Cristian Sima & George Salter
 * @version 21.11.2014
 */
 

/**
 * It is the reference for the current game. The game object is created ones the player who started the game decides to start playing 
 * @field
 * @type Game 
 * @see Game
 * @default null
 */
var game 			= null,
/**
 * If switched to true, it loads the settings of developers.
 * @field
 * @type boolean 
 * @default false
 */
	DEVELOPER_MODE 	= false;

$(document).ready(function(){
	new Connection();
});