import webapp2
import uuid
import random
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
            self.user.updateValues()

            building = Building.buildings[bname]['build']
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