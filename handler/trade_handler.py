
from default_handler import DefaultHandler

# Models
from model.game  import Game
from model.user  import User
from model.map   import Map
from model.queue import Queue

# Handles /game/* requests
#
class TradeHandler(DefaultHandler):

    def perform(self, tid):
        self.json = {
            "action" : "trade",
            "id"     : tid
        }

    def compPerform(self, tid):
    	#
    def userPerform(self, tid, uid):
    	#    