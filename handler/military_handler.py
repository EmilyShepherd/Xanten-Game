
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
        if not self.checkLogin(): return

        query = User.query(User.uid==city)
        num   = int(num)

        self.user.updateValues()

        if self.user.military == False:
            self.stderr('You don\'t have military building')
        elif self.user.peopleAtMilitary < num:
            self.stderr('You don\'t have enough people to attack')
        elif query.count() != 1:
            self.stderr('Attacking City doesn\'t exist')
        else:
            user   = query.fetch()[0]
            queueO = Queue(queueType = Queue.TYPE_ATTACK)
            queueO.attackTo   = user.uid
            queueO.number     = num
            self.user.addQueue(queueO, 20)

            self.user.peopleAtMilitary -= num
            self.user.put()
            queueO.put()

            self.json = {
                "status" : "sent",
                "time"   : 20
            }

    def send(self, city, num):
        self.json = {
            "action" : "send",
            "city" : city,
            "num"  : num
        }
        if self.user.military == False:
            self.stderr('You don\'t have military building')
        elif self.user.peopleAtMilitary < num:
            self.stderr('You don\'t have enough people')
        else:
            user = User.query(User.uid==city).fetch()[0]
            user.peopleAtMilitary += num
            self.user.peopleAtMilitary -= num
            self.user.put()
            user.put()


