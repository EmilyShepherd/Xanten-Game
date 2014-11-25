import webapp2
import uuid
import random
import math
import datetime

from default_handler import DefaultHandler

# Models
from model.game     import Game
from model.user     import User
from model.map      import Map
from model.building import Building

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

        self.updateValues(True)

        self.json['level']     = User.LEVEL_NAMES[self.user.level - 1]

        self.json['resources'] = {
            'gold'  : math.floor(self.user.gold),
            'food'  : math.floor(self.user.food),
            'wood'  : math.floor(self.user.wood),
            'stone' : math.floor(self.user.stone)
        }
        
        self.json['buildings'] = {
            'home'        : {
                'num'    : 1,
                'level'  : self.user.homeLvl,
                'people' : self.user.peopleAtHome
            },
            'house'       : {
                'num' : self.user.houses
            },
            'trade'       : {
                'num'    : 1 if self.user.trade else 0,
                'people' : self.user.peopleAtTrade
            },
            'grapevine'   : {
                'num'    : 1 if self.user.grapevine else 0,
                'people' : self.user.peopleAtGrapevine
            },
            'storage'    : {
                'num'   : 1 if self.user.storage else 0,
                'level' : self.user.storageLvl
            },
            'military'    : {
                'num'    : 1 if self.user.military else 0,
                'level ' : self.user.militaryLvl,
                'people' : self.user.peopleAtMilitary
            },
            'mine'        : {
                'num'    : self.user.mines,
                'level'  : self.user.mineLvl,
                'people' : self.user.peopleAtMine
            },
            'lumberjack'  : {
                'num'    : self.user.lumberjacks,
                'level'  : self.user.lumberjackLvl,
                'people' : self.user.peopleAtLumberjack
            },
            'dock'        : {
                'num'    : self.user.docks,
                'level'  : self.user.dockLvl,
                'people' : self.user.peopleAtDock
            }
        }

    def create(self, bname):
        if not self.checkLogin(): return

        building = Building.buildings[bname]

        if not building:
            self.stderr('Unknown Building Type')
        else:
            self.updateValues(False)
            cost = building['cost']

            if self.user.buildingQueue:
                self.stderr('You are already building')
                self.showBuildStatus()
            elif self.user.gold < cost['gold'] or self.user.wood < cost['wood'] or self.user.stone < cost['stone']:
                self.stderr('Not enough resources!')
            else:
                self.user.gold  -= cost['gold']
                self.user.wood  -= cost['wood']
                self.user.stone -= cost['stone']

                self.user.buildingQueue  = bname
                self.user.setBuildFinished(building['time'])
                self.user.put()

                self.json['status'] = 'Building Started'
                self.showBuildStatus()

    def showBuildStatus(self):
        self.json['building']    = self.user.buildingQueue
        self.json['secondsLeft'] = self.user.getBuildFinished()

    # Updates the user's resources based on the time since the last
    # update
    def updateValues(self, update):
        secs = self.user.markUpdate()

        self.user.food +=                                     \
              (self.user.peopleAtDock * self.user.level)      \
            * secs / 60.0
        self.user.food +=                                     \
              (self.user.peopleAtGrapevine * self.user.level) \
            * secs / 60.0
        self.user.wood +=                                     \
              (random.randrange(1, 19) / 10.0) * 0.3          \
            * self.user.lumberjackLvl                         \
            * self.user.peopleAtLumberjack                    \
            * self.user.lumberjacks                           \
            * secs / 60.0
        self.user.gold +=                                     \
              (random.randrange(1, 19) / 10.0) * 0.3          \
            * self.user.mineLvl                               \
            * self.user.peopleAtMine                          \
            * self.user.mines                                 \
            * secs / 60.0

        if (update): self.user.put()

    def updateResources(self, secs):
        pass