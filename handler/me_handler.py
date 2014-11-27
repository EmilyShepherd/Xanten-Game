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

    # Adds the given building to the given queue (build / level) and
    # deducts the resources (it checks there are enough first)
    def addBuildingToQueue(self, queue, bname):
        if not self.checkLogin(): return

        if queue not in ['build', 'level']:
            self.stderr('Unknown action: ' + queue)
        # The building type has to exist in order to be built, obviously
        if not Building.buildings.has_key(bname):
            self.stderr('Unknown Building Type')
        else:
            # Update the user's resouces & clear the building queue if
            # it has finished
            self.user.updateValues()

            building = Building.buildings[bname][queue]
            cost     = building['cost']
            attrName = queue + 'ingQueue'

            # You can only build one thing at a time
            if getattr(self.user, attrName):
                self.stderr('You are already ' + queue + 'ing')
                self.showQueueStatus(queue)
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

                # Special case
                # There's a chance mines will infact be Gold Mines :)
                if queue == 'build' and bname == 'mine':
                    chance = building['goldMineChance']
                    if random.randrange(0, 99) < chance:
                        bname = 'goldMine'

                # Actually save the values
                setattr(self.user, attrName, bname)
                self.user.setQueueFinished(queue, building['time'])
                self.user.put()

                self.json['status'] = 'Started'
                self.showQueueStatus(queue)

    # Returns the name of the current building in the queue, and how
    # many seconds until it is completed
    def showQueueStatus(self, queue):
        self.json[queue + 'ing'] = getattr(self.user, queue + 'ingQueue')
        self.json['secondsLeft'] = self.user.getQueueFinished(queue)