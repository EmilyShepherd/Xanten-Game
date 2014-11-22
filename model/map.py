
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
            # Tiles are coded as to what they are
            #   g is a plain grass block
            #   oa-* is grass with water at a corner
            #   oc-* is 3/4 grass with 1/4 water at the edge
            if tile.split('-')[0] in ['g', 'oa', 'oc']:
                num += 1

        return num