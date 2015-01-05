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
from model.queue    import Queue

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
            level = 1

            if queue == 'level':
                level = int(getattr(self.user, bname + 'Lvl')) + 1

            cost = Building.levelUpCost(bname, level)

            # You need to pay for what you build!
            if         self.user.gold  < cost['cost']['gold']    \
                    or self.user.wood  < cost['cost']['wood']    \
                    or self.user.stone < cost['cost']['stone']   \
                    or self.user.food  < cost['cost']['food']:
                self.stderr('Not enough resources!')
            # All checks successful, take the resources from the user
            # and put this into the building queue
            else:
                self.user.gold  -= cost['cost']['gold']
                self.user.wood  -= cost['cost']['wood']
                self.user.stone -= cost['cost']['stone']

                # Special case
                # There's a chance mines will infact be Gold Mines :)
                if queue == 'build' and bname == 'mine':
                    chance = Building.buildings['mine']['goldMineChance']
                    if random.randrange(0, 99) < chance:
                        bname = 'goldMine'

                queueO           = Queue()
                queueO.queueType = queue
                queueO.name      = bname
                self.user.addQueue(queueO, cost['time'])
                queueO.put()

                self.json['status'] = 'Started'
                self.json['queue']  = queueO.toDict()

            self.user.put()

    # def addPeople(self):

    # Moves the specified number of people from one location to another
    def movePeople(self):
        self.checkLogin()
        self.user.updateValues()

        moveFrom = self.request.POST['from']
        moveTo   = self.request.POST['to']
        number   = int(self.request.POST['number'])
        fromAttr = 'peopleAt' + moveFrom.capitalize()
        toAttr   = 'peopleAt' + moveTo.capitalize()

        # Check they haven't given a stupid number of people (like
        # "cheese" or -88)
        if number <= 0:
            self.stderr('Number should be a positive integer')
        # Check that the from and to locations actually exist
        elif not self.user.hasBuilding(moveFrom):
            self.stderr('You don\'t have that kind of building')
        elif not self.user.hasBuilding(moveTo):
            self.stderr('You don\'t have that kind of building')
        # Make sure you're not trying to move more people than we have
        elif number > getattr(self.user, fromAttr):
            self.stderr('You don\'t have that many people')
        # Checks passed, actually do it
        else:
            # The number of people has an impact on resource
            # calcuations, so update this value now before moving the
            # people
            self.user.updateValues()

            building = Building.buildings[moveTo]['train']
            cost     = building['cost']

            # You need to pay for what you training!
            if         self.user.gold  < cost['gold']    \
                    or self.user.wood  < cost['wood']    \
                    or self.user.stone < cost['stone']   \
                    or self.user.food < cost['food']:
                self.stderr('Not enough resources!')
            # All checks successful, take the resources from the user
            # and put this into the building queue
            else:
                self.user.gold  -= cost['gold']
                self.user.wood  -= cost['wood']
                self.user.stone -= cost['stone']
                self.user.food  -= cost['food']

                setattr(
                    self.user, fromAttr,
                    getattr(self.user, fromAttr) - number
                )

                queue           = Queue()
                queue.queueType = 'people'
                queue.number    = number
                queue.name      = moveTo
                self.user.addQueue(queue, building['time'] * number)
                queue.put()

                self.json['status'] = 'moved'
                self.json['queue']  = queue.toDict()

            self.user.put()

    # def createPeople(self):
    #     self.checkLogin()
    #     self.user.updateValues()

    #     moveTo   = self.request.POST['to']
    #     number   = int(self.request.POST['number'])

    #     if number <= 0:
    #         self.stderr('Number should be a positive integer')
    #     # Check that the from and to locations actually exist
    #     elif not self.user.hasBuilding(moveTo):
    #         self.stderr('You don\'t have that kind of building')
    #     else:
    #         # The number of people has an impact on resource
    #         # calcuations, so update this value now before moving the
    #         # people
    #         self.user.updateValues()
            
    #     self.user.put()    
        