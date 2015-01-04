/**
 * Holds information regarding a unit
 * @memberOf Game.prototype
 */
game.unit = {
	"military": {
		"create": function(number) {
			return new Resources({
				resources: {
					"wood": 80 * number,
					"food": 10 * number
				},
				time: 20 * number
			});
		},
		"idle": function(number) {
			return Resources({
				resources: {
					gold: Math.ceil(number * 70.7),
					food: Math.ceil(number * 60.3)
				},
				interval: "one day"
			});
		},
		"attack": function(number) {
			return new Resources({
				resources: {
					gold: number * 30.8,
					food: number * 19
				},
				interval: "one day"
			});
		},
		"send": function(number) {
			return new Resources({
				resources: {
					gold: number * 15.4,
					food: number * 9.5
				}
			});
		}
	},
	"miller": {
		"create": function(number) {
			return new Resources({
				resources: {
					"food": 15 * number
				},
				time: 10 * number
			});
		},
		"work": function(number) {
			return new Resources({
				resources: {
					satisfaction: 20 * number
				},
				interval: "one day"
			});
		}
	},
	"miner": {
		"create": function(number) {
			return new Resources({
				resources: {
					"food": 15 * number
				},
				time: 10 * number
			});
		},
		"work": function(number) {
			return new Resources({
				resources: {
					stone: 20 * number
				},
				interval: "one day"
			});
		}
	},
	"lumberjack": {
		"create": function(number) {
			return new Resources({
				resources: {
					"food": 15 * number
				},
				time: 10 * number
			});
		},
		"work": function(number) {
			return new Resources({
				resources: {
					wood: 20 * number
				},
				interval: "one day"
			});
		}
	},
	"farmer": {
		"create": function(number) {
			return new Resources({
				resources: {
					"food": 15 * number
				},
				time: 10 * number
			});
		},
		"work": function(number) {
			return new Resources({
				resources: {
					food: 20 * number
				},
				interval: "one day"
			});
		}
	},
	"trade": function(number, value, what) {
		var r = {
			"people": Math.ceil(number / 10),
			resources: {}
		};
		r.resources[what] = number * value;
		return new Resources(r);
	}
};