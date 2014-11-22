import webapp2
import uuid

from default_handler import DefaultHandler

# Models
from model.game import Game
from model.user import User
from model.map import Map

# Handles /me/* requests
#
class MeHandler(DefaultHandler):

    # GET /me
    #
    # This method simply returns a JSON array of all the user's details.
    # It includes values such as their resource levels, and what
    # buildings they have
    def get(self):

        # Have to be loged in
        if not self.checkLogin(): return

        # 
        self.updateValues()

        self.json['level']     = User.LEVEL_NAMES[self.user.level - 1]
        self.json['people']    = self.user.people

        self.json['resources'] = {
            'gold'  : self.user.gold,
            'food'  : self.user.food,
            'wood'  : self.user.wood,
            'stone' : self.user.stone
        }
        
        self.json['buildings'] = {
            'home'       : {
                'num'   : 1,
                'level' : self.user.homeLvl
            },
            'house'      : {
                'num' : self.user.houses
            },
            'trade'      : {
                'num' : 1 if self.user.trade else 0
            },
            'grapevine'  : {
                'num' : 1 if self.user.grapevine else 0
            },
            'storage'    : {
                'num'   : 1 if self.user.storage else 0,
                'level' : self.user.storageLvl
            },
            'military'    : {
                'num'   : 1 if self.user.military else 0,
                'level' : self.user.militaryLvl
            },
            'mine'    : {
                'num'   : self.user.mines,
                'level' : self.user.mineLvl
            },
            'lumberjack'    : {
                'num'   : self.user.lumberjacks,
                'level' : self.user.lumberjackLvl
            },
            'dock'    : {
                'num'   : self.user.docks,
                'level' : self.user.dockLvl
            }
        }

    # Updates the user's resources based on the time since the last
    # update
    def updateValues(self):
        pass