/**
 * Holds information regarding the buildings and elements
 * @memberOf Game.prototype
 */
game.constructions = {};

/**
 * Holds information regarding the buildings: name, maxLevel, maxNumber, capacity, cost to upgrade and worker (name of the worker)
 * @memberOf Game.prototype
 */
game.constructions.buildings = {
	
	"administration": {
		id: 1,
		name: "administration",
		maxNumber: 1,
		maxLevel: 50,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner 
		 */
		capacity: function(level) {
			return {};
			// TODO @George
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 100 * Math.pow(1.35, level),
					'stone': 100 * Math.pow(1.35, level),
					'gold': 10 * level
				},
				people: 0.05 * game.player.city.getNumberOfPeople(),
				time: 10 * level
			});
		},
		/**
		 * It returns the name of the workers of this building
		 * @inner
		 * @param {number} number The number of workers
		 * @return {string} The name of workers for this building
		 */
		worker: function(number){
			return (number === 1)?"Free person":"Free people";
		}
	},
	"military": {
		id: 2,
		name: "military",
		maxNumber: 1,
		maxLevel: null,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner  
		 */
		capacity: function(level) {
			return new Resources({
				"resources": {
					"military": Math.pow(4, level)
				}
			});
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 10 * Math.pow(1.35, level),
					'stone': 10 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 10 * level
			})
		},
		/**
		 * It returns the name of the workers of this building
		 * @inner
		 * @param {number} number The number of workers
		 * @return {string} The name of workers for this building
		 */
		worker: function(number){
			return (number === 1)?"Military unit":"Military units";
		}
	},
	"storage": {
		id: 3,
		name: "storage",
		maxNumber: 1,
		maxLevel: 10,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner  
		 */
		capacity: function(level) {
			return new Resources({
				unit: "%",
				"resources": {
					"food": 5 * level,
					"wood": 5 * level,
					"stone": 5 * level
				}
			});
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 5 * Math.pow(1.35, level),
					'stone': 5 * Math.pow(1.35, level)
				},
				people: 0.05 * game.player.city.getNumberOfPeople(),
				time: 10 * level
			});
		}
		/*
		 * It does not have workers
		 */
	},
	"mill": {
		id: 4,
		name: "mill",
		maxNumber: 1,
		maxLevel: 10,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner  
		 */
		capacity: function(level) {
			return new Resources({
				"resources": {
					"food": game.player.city.buildings.mill.people * level
				}
			});
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 8 * Math.pow(1.35, level),
					'stone': 8 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 10 * level
			});
		},
		/**
		 * It returns the name of the workers of this building
		 * @inner
		 * @param {number} number The number of workers
		 * @return {string} The name of workers for this building
		 */
		worker: function(number){
			return (number === 1)?"Smallholder":"Smallholders";
		}
	},
	"mine": {
		id: 5,
		name: "mine",
		maxNumber: 1,
		maxLevel: 10,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner  
		 */
		capacity: function(level) {
			return new Resources({
				"resources": {
					"stone": 0.5 * level * game.player.city.buildings.mine.num * game.player.city.buildings.mine.people,
					"people": Math.pow(4, level)
				}
			})
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 12 * Math.pow(1.35, level),
					'stone': 1 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 15 * level
			});
		},
		/**
		 * It returns the name of the workers of this building
		 * @inner
		 * @param {number} number The number of workers
		 * @return {string} The name of workers for this building
		 */
		worker: function(number){
			return (number === 1)?"Miner":"Miners";
		}
	},
	"house": {
		id: 6,
		name: "house",
		maxNumber: null,
		maxLevel: null,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner  
		 */
		capacity: function(level) {
			return new Resources({
				"people": (1000 * Math.pow(1.1, game.player.getLevel()) * game.player.city.buildings.house.num)
			});
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 2 * Math.pow(1.35, level),
					'stone': 3 * Math.pow(1.35, level)
				},
				people: 7 * level,
				time: 7 * level
			});
		}
		/*
		 * It does not have workers
		 */
	},
	"trade": {
		id: 7,
		name: "trade",
		maxNumber: 1,
		maxLevel: 10,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner  
		 */
		capacity: function(level) {
			return new Resources({
				"resources": {
					"gold": 3 * Math.pow(5, level),
					"wood": 7 * Math.pow(5, level),
					"food": 5 * Math.pow(5, level),
					"stone": 8 * Math.pow(5, level)
				}
			});
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 7 * Math.pow(1.35, level),
					'stone': 7 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 10 * level
			});
		}
		/*
		 * It does not have workers
		 */
	},
	"lumberjack": {
		id: 8,
		name: "lumberjack",
		maxNumber: 1,
		maxLevel: 10,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner  
		 */
		capacity: function(level) {
			return new Resources({
				"resources": {
					"wood": 0.3 * level * game.player.city.buildings.lumberjack.num * game.player.city.buildings.lumberjack.people,
					"people": Math.pow(4, level)
				}
			});
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 1 * Math.pow(1.35, level),
					'stone': 13 * Math.pow(1.35, level)
				},
				people: 11 * level,
				time: 5 * level
			});
		},
		/**
		 * It returns the name of the workers of this building
		 * @inner
		 * @param {number} number The number of workers
		 * @return {string} The name of workers for this building
		 */
		worker: function(number){
			return (number === 1)?"Lumberjack":"Lumberjacks";
		}
	},
	"farm": {
		id: 9,
		name: "farm",
		maxNumber: 1,
		maxLevel: 10,
		/**
		 * It returns the capacity of the building for a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the capacity of the building
		 * @inner  
		 */
		capacity: function(level) {
			return new Resources({
				"resources": {
					"food": 0.3 * level * game.player.city.buildings.farm.num * game.player.city.buildings.farm.people,
					"people": Math.pow(4, level)
				}
			});
		},
		/**
		 * It returns the necessary resources in order to level up the building to a given level
		 * @param {number} level The level of the building
		 * @return {Resource} A Resources object which describe the necessary resources in order to level up the building to a given level
		 * @inner  
		 */
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 3 * Math.pow(1.35, level),
					'stone': 2 * Math.pow(1.35, level)
				},
				people: 7 * level,
				time: 7 * level
			});
		},
		/**
		 * It returns the name of the workers of this building
		 * @inner
		 * @param {number} number The number of workers
		 * @return {string} The name of workers for this building
		 */
		worker: function(number){
			return (number === 1)?"Farmer":"Farmers";
		}
	}
};

/**
 * Holds information regarding the elements
 * @memberOf Game.prototype
 */
game.constructions.elements = {
	"Wood_Tower": {
		id: 1,
		name: "Wood Tower",
		img: "tower.png"
	},
	"Plant": {
		id: 2,
		name: "Swamp",
		img: "plant.png"
	},
	"Sign Crossroad": {
		id: 3,
		name: "Sign Crossroad",
		img: "sign_crossroad.png"
	},
	"Statue": {
		id: 4,
		name: "Statue",
		img: "statue.png"
	},
	"Stone_Tower": {
		id: 5,
		name: "Stone Tower",
		img: "tower.png"
	},
	"Post": {
		id: 6,
		name: "Post",
		img: "post.png"
	},
	"Totem": {
		id: 7,
		name: "Totem",
		img: "totem.png"
	},
	"Obelisk": {
		id: 8,
		name: "Obelisk",
		img: "obelisk.png"
	}	
};

/**
 * It returns the data object of a building using the id of the building
 * @param {number} id The id of the building
 * @return {object} The object which contain information regarding the building
 * @memberOf Game.prototype
 */
game.constructions.getBuildingById = function(id) {
	for (b in game.constructions.buildings) {
		if (game.constructions.buildings[b].id === id) {
			return game.constructions.buildings[b];
		}
	}
};

/**
 * It returns the data object of a element using the id of the building
 * @param {number} id The id of the building
 * @return {object} The object which contain information regarding the building
 * @memberOf Game.prototype
 */
game.constructions.getElementById = function(id) {
	for (e in game.constructions.elements) {
		if (game.constructions.elements[e].id === id) {
			return game.constructions.elements[e];
		}
	}
};