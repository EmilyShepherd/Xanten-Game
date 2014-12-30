
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

    def send(self, city, num):
        self.json = {
            "action" : "send",
            "city" : city,
            "num"  : num
        }