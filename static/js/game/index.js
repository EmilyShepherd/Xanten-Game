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
 * If switched to true, it loads the settings of developers. When set to true, it should be provided a file developer.js which indicates the structure of the game
 * @field
 * @type boolean 
 * @default false
 */
	DEVELOPER_MODE 	= false,
	/**
	 * A reference to the connection to the server. It is created after the page loads
	 * @field
	 * @type Connection 
	 * @see Connection
	 * @default null
	 */
	connection = {};

$(document).ready(function(){
	connection = new Connection();
});