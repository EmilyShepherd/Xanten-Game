
# Static datastore of the cost and build times of each type of building
class Building:

    # The actual store
    buildings = {
        "administration" : {
            "level" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 100,
                    "stone" : 100
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            }
        },
        # Docks produce food! :)
        "trade" : {
            "level" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 6
            }
        },
        # Mines produce stone, but there's a chance they will be
        # goldMines
        "mill" : {
            "level" : {
                "cost" : {
                    "gold" : 8,
                    "wood" : 8,
                    "stone" : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 6
            }
        },
        "storage" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 5,
                    "stone" : 5
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 6
            }
        },
        "military" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 10,
                    "stone" : 10
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 6
            }
        },
        "mine" : {
            "level" : {
                "cost" : {
                    "gold" : 0,
                    "wood" : 12,
                    "stone" : 1
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 6
            },
            "goldMineChance" : 10
        },
        "lumberjack" : {
            "level" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 6
            }
        },
        "farm" : {
            "level" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 6
            }
        },
        "house" : {
            "level" : {
                "cost" : {
                    "gold" : 1000000000000,
                    "wood" : 1000000000000,
                    "stone" : 1000000000000
                },
                "time" : 10
            },
            "train" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 6
            }
        }
    }

    @staticmethod
    def levelUpCost(building, level):
        cost = Building.buildings[building]['level']

        return {
            "cost" : {
                "gold" : cost['cost']["gold"]  * level,
                "wood" : cost['cost']["wood"]  * (1.35 ** level),
                "stone" : cost["cost"]["wood"] * (1.35 ** level)
            },
            "time" : cost["time"] * level
        }
