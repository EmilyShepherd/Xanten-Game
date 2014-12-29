from google.appengine.ext import ndb
import uuid

from default_handler import DefaultHandler

from game_handler import GameHandler

from model.game import Game
from model.user import User
from model.map import Map
from model.queue import Queue

# Handles /debug/* requests
#
# NOT TO BE INCLUDED IN FINAL PROJECT
class DebugHandler(DefaultHandler):

    # GET /debug/purge/<table>
    #
    # Deletes every entity in the given table
    #
    # WARNING: This may break links between tables, which the system
    # assumes are present. Using this incorrectly may cause system
    # instability (use /debug/purge instead to delete everything)
    def purge(self, table):
        if table.lower() == 'user':
            ndb.delete_multi(User.query().fetch(keys_only=True))
        elif table.lower() == 'game':
            ndb.delete_multi(Game.query().fetch(keys_only=True))
        elif table.lower() == 'queue':
            ndb.delete_multi(Queue.query().fetch(keys_only=True))

        self.json['status'] = 'Deleted'

    # GET /debug/purge
    #
    # Deletes all data in all tables
    def purgeAll(self):
        self.purge('user')
        self.purge('game')
        self.purge('queue')

    # GET /debug/me
    #
    # This method simply returns a JSON array of all the user's details.
    # It includes values such as their resource levels, and what
    # buildings they have
    def me(self):

        # Have to be loged in
        if not self.checkLogin(): return

        self.user.updateValues()

        self.json = self.user.toDict()

    def login(self):
        gameO            = Game(gid = uuid.uuid4().hex)
        game = GameHandler(self.request, self.response)
        game.join_game(gameO, 'User')

        self.stderr('done')

    def test(self):
        self.json['game'] = {
            "maps" : {
                "city" : {
                    "array" : Map.generateCityMap(),
                    "backgrounds": {
                        "1": {
                            "allowBuildings": True,
                            "allowConstructions": False,
                            "img": "1.png"
                        },
                        "2": {
                            "allowBuildings": False,
                            "allowConstructions": False,
                            "img": "2.png"
                        }
                    }
                }
            }
        }
