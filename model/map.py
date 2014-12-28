import random

# Represents a map
#
# Contains static methods used for parsing the map string created by the
# JavaScript map generator
class Map:

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
        self.tiles = mapStr.split(',')

    # Picks a random inhabital / free tile, marks it as taken and
    # returns its id
    def pickRandomTile(self):
        while True:
            place = random.randrange(0, len(self.tiles))
            if Map.tileInhabital(self.tiles[place]):
                self.tiles[place] = 'taken'
                return place

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

        return cMap