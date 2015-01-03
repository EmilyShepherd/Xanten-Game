/*
 *
 * This starts a default game and enters the game without the create/join promt
 */
var developer = {};

developer.settings = {
	"developerMode": true,
	"defaultMap": "city" // avoid the connection and effects
};

developer.game = {
	game: {
		data: {
			"status": "started",
			"token": "the token",
		},
		"maps": {
			"city": {
				"array": [
					[{
						"id_background": 1,
						"type_construction": "building",
						"id_construction": 1
					}, {
						"id_background": 2,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 2,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 2,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}],
					[{
						"id_background": 1,
						"type_construction": "building",
						"id_construction": 2
					}, {
						"id_background": 2,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 2,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}],
					[{
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": "building",
						"id_construction": 3
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}],
					[{
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": 'element',
						"id_construction": 2
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": "element",
						"id_construction": 1
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}],
					[{
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": "building",
						"id_construction": 4
					}, {
						"id_background": 1,
						"type_construction": "building",
						"id_construction": 5
					}],
					[{
						"id_background": 1,
						"type_construction": "building",
						"id_construction": 6
					}, {
						"id_background": 1,
						"type_construction": "building",
						"id_construction": 7
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}],
					[{
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}, {
						"id_background": 1,
						"type_construction": null,
						"id_construction": null
					}]
				],
				"backgrounds": {
					1: {
						allowBuildings: true,
						allowConstructions: false,
						img: "1.png"
					},
					2: {
						allowBuildings: false,
						allowConstructions: false,
						img: "2.png"
					}
				}
			},
			"world": {
				array: [
					[{
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": 2
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 3,
						"id_city": null
					}, {
						"id_background": 4,
						"id_city": null
					}],
					[{
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": 1
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 5,
						"id_city": null
					}, {
						"id_background": 6,
						"id_city": null
					}],
					[{
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": 3
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}],
					[{
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}],
					[{
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}],
					[{
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}],
					[{
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}, {
						"id_background": 1,
						"id_city": null
					}]
				],
				"backgrounds": {
					1: {
						allowCity: true,
						img: "1.png"
					},
					2: {
						allowCity: true,
						img: "2.png"
					},
					3: {
						allowCity: true,
						img: "3.png"
					},
					4: {
						allowCity: true,
						img: "4.png"
					},
					5: {
						allowCity: true,
						img: "5.png"
					},
					6: {
						allowCity: true,
						img: "6.png"
					}
				},
				"players": {
					1: {
						id: 1,
						name: "Fantomous",
						level: 7
					},
					2: {
						id: 2,
						name: "Glacious",
						level: 6
					},
					3: {
						id: 3,
						name: "Oldistinesti",
						level: 34
					}
				}
			}
		}
	},
	"player": {
		"id": 1,
		"level": 7,
		"resources": {
			"gold": 50.0,
			"stone": 200.0,
			"wood": 200.0,
			"food": 200.0
		},
		"buildings": {
			"storage": {
				"level": 7,
				"num": 1
			},
			"mine": {
				"level": 1,
				"num": 1,
				"people": 0
			},
			"mill": {
				"level": 1,
				"num": 1,
				"people": 0
			},
			"house": {
				"num": 1
			},
			"trade": {
				"level": 1,
				"people": 0,
				"num": 1
			},
			"military": {
				"people": 3,
				"num": 1,
				"level": 1
			},
			"lumberjack": {
				"level": 0,
				"num": 0,
				"people": 0
			},
			"farm": {
				"people": 0,
				"num": 0,
				"level": 0
			},
			"administration": {
				"level": 1,
				"num": 1,
				"people": 50
			}
		}
	},
	"tasks": {
		"militaryMovements": {
			1: {
				path: [
					[0, 1],
					[0, 4],
					[4, 5]
				],
				from: 1,
				to: 1,
				resources: {
					resources: {
						"food": 100,
						wood: 2220,
						military: 100
					},
					time: 20
				}
			}
		}
	},
	
}