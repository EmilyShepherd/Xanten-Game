
from default_handler import DefaultHandler

# Models
from model.game  import Game
from model.user  import User
from model.map   import Map
from model.queue import Queue

# Handles /game/* requests
#
class MilitaryHandler(DefaultHandler):

    def attack(self, city, num):
        self.json = {
            "action" : "attack",
            "city"   : city,
            "num"    : num
        }

        if self.user.military = False:
            self.stderr('You don\'t have military building')
        elif self.user.peopleAtMilitary = 0:
            self.stderr('You don\'t have enough people to attack')
        else:
            self.user.updateValues()
            user = User.query(User.uid==city).fetch()[0]
            user.updateValues()
            user.peopleAtHome = user.peopleAtHome - ((random.randint(39, 80)/100) * user.peopleAtHome)
            #Stolen resources
            wood = user.wood - (5% * user.storageLvl) * user.wood
            gold = user.gold - (5% * user.storageLvl) * user.gold
            food = user.food - (5% * user.storageLvl) * user.food
            stone = user.stone - (5% * user.storageLvl) * user.stone

            #Add to the user
            self.user.wood +=  wood
            self.user.gold +=  gold
            self.user.food +=  food
            self.user.stone += stone

            #Minus the attacked city
            user.wood -=  wood
            user.gold -=  gold
            user.food -=  food
            user.stone -= stone

            self.user.put()
            user.put()

    def send(self, city, num):
        self.json = {
            "action" : "send",
            "city" : city,
            "num"  : num
        }
        if self.user.military = False:
            self.stderr('You don\'t have military building')
        elif self.user.peopleAtMilitary < num:
            self.stderr('You don\'t have enough people')
        else:
            user = User.query(User.uid==city).fetch()[0]
            user.peopleAtMilitary += num
            self.user.peopleAtMilitary -= num
            self.user.put()
            user.put()


