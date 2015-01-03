
# Static datastore of the cost and build times of each type of building
class Building:

    # The actual store
    buildings = {
        "administration" : {
            "build" : {
                "cost" : {
                    "gold" : 100000000000,
                    "wood" : 100000000000,
                    "stone" : 100000000000
                }
            },
            "level" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 100,
                    "stone" : 100
                },
                "time" : 10
            }
        },
        # Docks produce food! :)
        "trade" : {
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
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
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
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
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
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
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
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
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10,
                "goldMineChance" : 10
            },
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
            }
        },
        "lumberjack" : {
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
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
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
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
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 10
            },
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