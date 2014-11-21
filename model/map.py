
class Map:
    @staticmethod
    def countInhabitalSpace(mapStr):
        num = 0;

        for tile in mapStr.split(','):
            if tile.split('-')[0] in ['g', 'oa', 'oc']:
                num += 1

        return num