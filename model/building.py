import math
# Static datastore of the cost and build times of each type of building
class Building:

    # The actual store
    buildings = {
        "administration" : {
            "level" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 100,
                    "stone" : 100,
                    "food"  : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 0,
                    "stone" : 0,
                    "food"  : 15
                },
                "time" : 10
            }
        },
        # Docks produce food! :)
        "trade" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 7,
                    "stone" : 7,
                    "food"  : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 0,
                    "stone" : 0,
                    "food"  : 0
                },
                "time" : 0
            }
        },
        # Mines produce stone, but there's a chance they will be
        # goldMines
        "mill" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 8,
                    "stone" : 8,
                    "food"  : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 0,
                    "stone" : 0,
                    "food"  : 15
                },
                "time" : 10
            }
        },
        "storage" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 5,
                    "stone" : 5,
                    "food"  : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0,
                    "food"  : 0
                },
                "time" : 6
            }
        },
        "military" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 10,
                    "stone" : 10,
                    "food"  : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 80,
                    "stone" : 0,
                    "food"  : 10
                },
                "time" : 20
            }
        },
        "mine" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 12,
                    "stone" : 1,
                    "food"  : 0
                },
                "time" : 15
            },
            "train" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 0,
                    "stone" : 0,
                    "food"  : 15
                },
                "time" : 20
            },
            "goldMineChance" : 10
        },
        "lumberjack" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 1,
                    "stone" : 13,
                    "food" : 0
                },
                "time" : 5
            },
            "train" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 0,
                    "stone" : 0,
                    "food"  : 15
                },
                "time" : 10
            }
        },
        "farm" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 3,
                    "stone" : 2,
                    "food"  : 0
                },
                "time" : 7
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0,
                    "food"  : 15
                },
                "time" : 10
            }
        },
        "house" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 2,
                    "stone" : 3,
                    "food"  : 0
                },
                "time" : 7
            },
            "train" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 0,
                    "stone" : 0,
                    "food"  : 0
                },
                "time" : 0
            }
        }
    }

    @staticmethod
    def levelUpCost(building, level):
        cost = Building.buildings[building]['level']
        exp=1.35
        return {
            "cost" : {
                "gold" : cost['cost']["gold"]  * level,
                "wood" : math.ceil(cost['cost']["wood"]  * math.pow(exp,level)),
                "stone" : math.ceil(cost["cost"]["stone"] * math.pow(exp,level)),
                "food" : math.ceil(cost["cost"]["food"] * math.pow(exp,level))
            },
            "time" : cost["time"] * level
        }
