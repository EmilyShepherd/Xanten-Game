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
			})
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
		}
	},
	"miner": {
		"create": function (){
			return new Resources({
				
			});
		}
	}
};