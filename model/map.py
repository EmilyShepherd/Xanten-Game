import random
import json

# Represents a map
#
# Contains static methods used for parsing the map string created by the
# JavaScript map generator
class Map:

    WORLD_TILE_TYPES = {
        "g" : {
            "img"       : "",
            "allowCity" : True,
            "time"      : 30
        },
        "m0" : {
            "img"       : "",
            "allowCity" : False,
            "time"      : 210
        },
        "m1" : {
            "img"       : "",
            "allowCity" : False,
            "time"      : 210
        },
        "t0" : {
            "img"       : "",
            "allowCity" : False,
            "time"      : 180
        },
        "t1" : {
            "img"       : "",
            "allowCity" : False,
            "time"      : 180
        },
        "o" : {
            "img"       : "",
            "allowCity" : False,
            "time"      : 300
        }
    }

    CITY_TILE_TYPES = {
        1: {
            "allowBuildings"     : True,
            "allowConstructions" : False,
            "img"                : "1.png"
        },
        2: {
            "allowBuildings"     : False,
            "allowConstructions" : False,
            "img"                : "2.png"
        }
    }

    # Reads a map string and counts the number of tiles that can take
    # a player's settlement
    @staticmethod
    def countInhabitalSpace(mapStr):
        num = 0;

        for tile in mapStr.split(','):
            if Map.tileInhabital(tile):
                num += 1

        return num

    # Checks if the given tile string is inhabital
    @staticmethod
    def tileInhabital(tile):
        # Tiles are coded as to what they are
        #   g is a plain grass block
        #   oa-* is grass with water at a corner
        #   oc-* is 3/4 grass with 1/4 water at the edge
        return tile.split('-')[0] in ['g', 'oa', 'oc']

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

    def getTileAt(self, pos):
        y = pos / len(self.mapArr)
        x = pos % len(self.mapArr)

        return self.mapArr[y][x]

    def saveTileAt(self, pos, tile):
        y = pos / len(self.mapArr)
        x = pos % len(self.mapArr)

        self.mapArr[y][x] = tile

    def isTileHabitable(self, tile):
        return tile['id_background'].split('-')[0] in ['g', 'oa', 'oc']

    def countHabitable(self):
        num = 0

        for y in range(0, len(this.mapArr)):
            for x in range(0, len(this.mapArr)):
                if self.isTileHabitable(self.mapArr[y][x]):
                    num += 1

        return num

    def toDict(self):
        if self.mode == 'w':
            tiles = self.WORLD_TILE_TYPES
        else:
            tiles = self.CITY_TILE_TYPES

        return {
            "array"       : self.mapArr,
            "backgrounds" : tiles
        }

    @staticmethod
    def convertToWorldMap(mapStr):
        x = 0
        y = 0
        wMap = [ ]

        for tile in mapStr.split(','):
            if x == 0:
                wMap.append([ ])

            #tile  = tile.split('-')
            wTile = {
                "id_background" : tile,
                "id_city"       : None
            }

            wMap[y].append(wTile)

            x += 1
            if x == 7:
                y += 1
                x = 0

        mapO        = Map('w{}')
        mapO.mapArr = wMap

        return mapO

    def toString(self):
        return self.mode + json.dumps(self.mapArr)

    @staticmethod
    def generateCityMap():
        cMap = [ ]
        treesInColoum = [0] * 7

        for y in range(0, 6):
            cMap.append([ ])
            treesInRow = 0
            for x in range(0, 6):
                cMap[y].append({
                    "type_construction" : None,
                    "id_construction"   : None
                })

                if treesInRow == 3:
                    probability = 0
                else:
                    surroundingTrees = treesInRow

                    if y != 0:
                        surroundingTrees += treesInColoum[x]
                        if x != 0:
                            surroundingTrees += treesInColoum[x - 1]
                        if x != 6:
                            surroundingTrees += treesInColoum[x + 1]

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

                if random.randrange(0, 100) < probability:
                    treesInRow       += 1
                    treesInColoum[x] += 1
                    cMap[y][x]['id_background'] = 2
                else:
                    #treesInRow       = 0
                    #treesInColoum[x] = 0
                    cMap[y][x]['id_background'] = 1

                    if random.randrange(0, 100) < 10:
                        cMap[y][x]['type_construction'] = 'element'
                        cMap[y][x]['id_construction']   = random.randrange(1, 3)

        mapO        = Map('c{}')
        mapO.mapArr = cMap

        return mapO