/**
 * Holds information regarding the buildings and elements
 */
game.constructions = {};

/**
 * Holds information regarding the buildings: name, maxLevel, maxNumber, capacity, cost to upgrade
 */
game.constructions.buildings = {
	"administration": {
		id: 1,
		name: "administration",
		maxNumber: 1,
		maxLevel: 50,
		capacity: function(level) {
			return {};
			// TODO @George
		},
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
		}
	},
	"military": {
		id: 2,
		name: "military",
		maxNumber: 1,
		maxLevel: null,
		capacity: function(level) {
			return new Resources({
				"resources": {
					"military": Math.floor(4 ^ level)
				}
			});
		},
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 10 * Math.pow(1.35, level),
					'stone': 10 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 10 * level
			})
		}
	},
	"storage": {
		id: 3,
		name: "storage",
		maxNumber: 1,
		maxLevel: 10,
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
	},
	"mill": {
		id: 4,
		name: "mill",
		maxNumber: 1,
		maxLevel: 10,
		capacity: function(level) {
			return new Resources({
				"resources": {
					"food": game.player.city.buildings.mill.people * level
				}
			});
		},
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 8 * Math.pow(1.35, level),
					'stone': 8 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 10 * level
			});
		}
	},
	"mine": {
		id: 5,
		name: "mine",
		maxNumber: 1,
		maxLevel: 10,
		capacity: function(level) {
			return new Resources({
				"resources": {
					"stone": 0.5 * level * game.player.city.buildings.mine.num * game.player.city.buildings.mine.people
				}
			})
		},
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 12 * Math.pow(1.35, level),
					'stone': 1 * Math.pow(1.35, level)
				},
				people: 10 * level,
				time: 15 * level
			});
		}
	},
	"house": {
		id: 6,
		name: "house",
		maxNumber: null,
		maxLevel: null,
		capacity: function(level) {
			return new Resources({
				"people": (1000 * 1.1 ^ (game.player.level)) * game.player.city.buildings.house.num
			});
		},
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
	},
	"trade": {
		id: 7,
		name: "trade",
		maxNumber: 10,
		maxLevel: 1,
		capacity: function(level) {
			return new Resources({
				"resources": {
					"gold": 3 * 5 ^ level,
					"wood": 7 * 5 ^ level,
					"food": 5 * 5 ^ level,
					"stone": 8 * 5 ^ level
				}
			});
		},
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
	},
	"lumberjack": {
		id: 8,
		name: "lumberjack",
		maxNumber: 1,
		maxLevel: 10,
		capacity: function(level) {
			return new Resources({
				"resources": {
					"wood": 0.3 * level * game.player.city.buildings.lumberjack.num * game.player.city.buildings.lumberjack.people
				}
			});
		},
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 1 * Math.pow(1.35, level),
					'stone': 13 * Math.pow(1.35, level)
				},
				people: 11 * level,
				time: 5 * level
			});
		}
	},
	"farm": {
		id: 9,
		name: "farm",
		maxNumber: 1,
		maxLevel: 10,
		capacity: function(level) {
			return new Resources({
				"resources": {
					"food": 0.3 * level * game.player.city.buildings.farm.num * game.player.city.buildings.farm.people
				}
			});
		},
		levelUp: function(level) {
			return new Resources({
				resources: {
					'wood': 3 * Math.pow(1.35, level),
					'stone': 2 * Math.pow(1.35, level)
				},
				people: 7 * level,
				time: 7 * level
			});
		}
	}
};
/**
 * Holds information regarding the elements
 */
game.constructions.elements = {
	"Tower": {
		id: 1,
		name: "Tower",
		img: "tower.png"
	},
	"Plant": {
		id: 2,
		name: "Plant",
		img: "plant.png"
	}
};

/**
 * It returns the data object of a building using the id of the building
 * @param (number) id The id of the building
 * @return (object) The object which contain information regarding the building
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
 * @param (number) id The id of the building
 * @return (object) The object which contain information regarding the building
 */
game.constructions.getElementById = function(id) {
	for (e in game.constructions.elements) {
		if (game.constructions.elements[e].id === id) {
			return game.constructions.elements[e];
		}
	}
};