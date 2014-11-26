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

