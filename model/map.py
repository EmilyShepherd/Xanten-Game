import random
import json

# Represents a map
#
# Contains static methods used for parsing the map string created by the
# JavaScript map generator
class Map:

    # Tiles used on the world map
    WORLD_TILE_TYPES = {
        "g" : {
            "img"       : "g.png",
            "allowCity" : True,
            "time"      : 30
        },
        "m0" : {
            "img"       : "m0.png",
            "allowCity" : False,
            "time"      : 210
        },
        "m1" : {
            "img"       : "m1.png",
            "allowCity" : False,
            "time"      : 210
        },
        "t0" : {
            "img"       : "t0.png",
            "allowCity" : False,
            "time"      : 180
        },
        "t1" : {
            "img"       : "t1.png",
            "allowCity" : False,
            "time"      : 180
        },
        "o" : {
            "img"       : "o.png",
            "allowCity" : False,
            "time"      : 300
        },
        "oa-ne" : {
            "img"       : "oa-ne.png",
            "allowCity" : True,
            "time"      : 300
        },
        "oa-nw" : {
            "img"       : "oa-nw.png",
            "allowCity" : True,
            "time"      : 300
        },
        "ob-ne" : {
            "img"       : "ob-ne.png",
            "allowCity" : False,
            "time"      : 300
        },
        "ob-nw" : {
            "img"       : "ob-nw.png",
            "allowCity" : False,
            "time"      : 300
        },
        "ob-se" : {
            "img"       : "ob-se.png",
            "allowCity" : False,
            "time"      : 300
        },
        "ob-sw" : {
            "img"       : "ob-sw.png",
            "allowCity" : False,
            "time"      : 300
        },
        "oc-ne" : {
            "img"       : "oc-ne.png",
            "allowCity" : True,
            "time"      : 300
        },
        "oc-nw" : {
            "img"       : "oc-nw.png",
            "allowCity" : True,
            "time"      : 300
        },
        "oc-se" : {
            "img"       : "oc-se.png",
            "allowCity" : True,
            "time"      : 300
        },
        "oc-sw" : {
            "img"       : "oc-sw.png",
            "allowCity" : True,
            "time"      : 300
        },
        "o-e" : {
            "img"       : "o-e.png",
            "allowCity" : False,
            "time"      : 300
        },
        "o-n" : {
            "img"       : "o-n.png",
            "allowCity" : False,
            "time"      : 300
        },
        "o-s" : {
            "img"       : "o-s.png",
            "allowCity" : False,
            "time"      : 300
        },
        "o-w" : {
            "img"       : "o-w.png",
            "allowCity" : False,
            "time"      : 300
        }
    }

    # Tiles used on the City Map
    CITY_TILE_TYPES = {
        # Grass
        1: {
            "allowBuildings"     : True,
            "allowConstructions" : False,
            "img"                : "1.png"
        },
        # Tree
        2: {
            "allowBuildings"     : False,
            "allowConstructions" : False,
            "img"                : "2.png"
        }
    }

    # Takes a world map string in the format provided by the JavaScript
    # generator and converts it into the dict which is used by the
    # rest of the system. This returns a Map object wrapper for the
    # map array
    @staticmethod
    def convertToWorldMap(mapStr):
        x = 0
        y = 0
        wMap = [ ]

        for tile in mapStr.split(','):
            # Init this row if we're at the start
            if x == 0:
                wMap.append([ ])

            wMap[y].append({
                "id_background" : tile,
                "id_city"       : None
            })

            # Increase the pointer and loop round to the next row if
            # we're at the end
            x += 1
            if x == 7:
                y += 1
                x = 0

        # Wrap it up and return
        mapO        = Map('w{}')
        mapO.mapArr = wMap

        return mapO

    # Generates a city map with trees, towers and plants randomly placed
    # around. It also places the administration building in the first
    # availiable grass space
    #
    # Trees are generated such that they are more likely to spawn in
    # clumps (although if a clump becomes too large, the probability
    # drops to 0% to avoid the risk of a city covered by trees)
    @staticmethod
    def generateCityMap():
        cMap          = [ ]
        treesInColoum = [0] * 7
        doneHome      = False

        for y in range(0, 7):
            # Init this row
            cMap.append([ ])
            treesInRow = 0
            for x in range(0, 7):
                # Init this tile
                cMap[y].append({
                    "type_construction" : None,
                    "id_construction"   : None
                })

                # We count up the number of trees so we can come up with
                # a subtable probability that one will spawn here
                if treesInRow == 3:
                    probability = 0
                else:
                    surroundingTrees = treesInRow

                    # If this isn't the top row, look up
                    if y != 0:
                        surroundingTrees += treesInColoum[x]
                        if x != 0:
                            surroundingTrees += treesInColoum[x - 1]
                        if x != 6:
                            surroundingTrees += treesInColoum[x + 1]

                    # Work out a probability
                    if surroundingTrees == 0:
                        probability = 10
                    elif surroundingTrees < 7:
                        probability = 30
                    elif surroundingTrees == 7:
                        probability = 15
                    elif surroundingTrees < 10:
                        probability = 5
                    else:
                        probability = 0

                # Will this tile be a tree?
                if random.randrange(0, 100) < probability:
                    treesInRow       += 1
                    treesInColoum[x] += 1
                    cMap[y][x]['id_background'] = 2 # ID of tree
                else:
                    cMap[y][x]['id_background'] = 1 # ID of grass

                    # If we haven't got the administration building yet,
                    # plonk it here
                    if not doneHome:
                        cMap[y][x]['type_construction'] = 'building'
                        cMap[y][x]['id_construction']   = 1
                        doneHome                        = True
                    # There is also a 10% chance that this space will
                    # have some other feature in it, such as a tower or
                    # plant
                    if random.randrange(0, 100) < 10:
                        cMap[y][x]['type_construction'] = 'element'
                        cMap[y][x]['id_construction']   = random.randrange(1, 3)

        # Wrap it up and return
        mapO        = Map('c{}')
        mapO.mapArr = cMap

        return mapO

    # Parses a map string and saves the tiles
    def __init__(self, mapStr):
        self.mode   = mapStr[0]
        self.mapArr = json.loads(mapStr[1:])

    # Picks a random inhabital / free tile, marks it as taken and
    # returns its id
    def pickRandomTile(self, forUser):
        while True:
            place = random.randrange(0, len(self.mapArr) ** 2)
            tile  = self.getTileAt(place)
            if self.isTileHabitable(tile):
                tile['id_city'] = forUser.uid
                self.saveTileAt(place, tile)
                return place

    # Returns the tile at the given scalar position.
    #
    # Eg, position 8 maps to row 2, coloum 2
    def getTileAt(self, pos):
        y = pos / len(self.mapArr)
        x = pos % len(self.mapArr)

        return self.mapArr[y][x]

    # Saves the tile at the given scalar position
    #
    # Eg, position 8 maps to row 2, coloum 2
    def saveTileAt(self, pos, tile):
        y = pos / len(self.mapArr)
        x = pos % len(self.mapArr)

        self.mapArr[y][x] = tile

    # Returns true if the given tile can have a settlement on it
    def isTileHabitable(self, tile):
        return tile['id_background'].split('-')[0] in ['g', 'oa', 'oc'] and tile['id_city'] == None 

    # Count the habital spaces on the world map
    def countHabitable(self):
        num = 0

        for y in range(0, len(self.mapArr)):
            for x in range(0, len(self.mapArr)):
                if self.isTileHabitable(self.mapArr[y][x]):
                    num += 1

        return num

    # Returns the map object as a dictionary, so that it can be sent to
    # the client in a JSON object.
    #
    # It also includes a reference of the background meta-data for the
    # client to use
    def toDict(self):
        ret = { }
        ret["array"] = self.mapArr

        if self.mode == 'w':
            ret["backgrounds"] = self.WORLD_TILE_TYPES
        else:
            ret["backgrounds"] = self.CITY_TILE_TYPES

        return ret

    # Returns the map object as a serialised string for use of storing
    # in the database
    #
    # (We don't store the map object properly in the database as it is
    # rarely used and doesn't need to be searched)
    def toString(self):
        return self.mode + json.dumps(self.mapArr)