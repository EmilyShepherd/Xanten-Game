
# Static datastore of the cost and build times of each type of building
class Building:

    # The actual store
    buildings = {
        # Docks produce food! :)
        "trade" : {
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 600
            }
        },
        # Mines produce stone, but there's a chance they will be
        # goldMines
        "grapevine" : {
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 600
            }
        },
        "storage" : {
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 600
            }
        },
        "military" : {
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 600
            }
        },
        "mine" : {
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 600,
                "goldMineChance" : 10
            }
        },
        "lumberjack" : {
            "build" : {
                "cost" : {
                    "gold" : 10,
                    "wood" : 0,
                    "stone" : 0
                },
                "time" : 600
            }
        }
    }