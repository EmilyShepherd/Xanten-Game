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

        self.user.updateValues(True)

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

    # Allows the user to create a building (after checking that they
    # aren't currently building & have enough resources first)
    def create(self, bname):
        if not self.checkLogin(): return

        # The building type has to exist in order to be built, obviously
        if not Building.buildings.has_key(bname):
            self.stderr('Unknown Building Type')
        else:
            # Update the user's resouces & clear the building queue if
            # it has finished
            self.user.updateValues(False)

            building = Building.buildings[bname]
            cost     = building['cost']

            # You can only build one thing at a time
            if self.user.buildingQueue:
                self.stderr('You are already building')
                self.showBuildStatus()
            # You need to pay for what you build!
            elif       self.user.gold  < cost['gold']    \
                    or self.user.wood  < cost['wood']    \
                    or self.user.stone < cost['stone']:
                self.stderr('Not enough resources!')
            # All checks successful, take the resources from the user
            # and put this into the building queue
            else:
                self.user.gold  -= cost['gold']
                self.user.wood  -= cost['wood']
                self.user.stone -= cost['stone']

                # There's a chance mines will infact be Gold Mines :)
                if bname == 'mine':
                    chance = building['goldMineChance']
                    if random.randrange(0, 99) < chance:
                        bname = 'goldMine'

                self.user.buildingQueue  = bname
                self.user.setBuildFinished(building['time'])
                self.user.put()

                self.json['status'] = 'Building Started'
                self.showBuildStatus()

    # Returns the name of the current building in the queue, and how
    # many seconds until it is completed
    def showBuildStatus(self):
        self.json['building']    = self.user.buildingQueue
        self.json['secondsLeft'] = self.user.getBuildFinished()