from google.appengine.ext import ndb

from default_handler import DefaultHandler

from model.game import Game
from model.user import User

class DebugHandler(DefaultHandler):

    def purge(self, table):
        if table.lower() == 'user':
            ndb.delete_multi(User.query().fetch(keys_only=True))
        elif table.lower() == 'game':
            ndb.delete_multi(Game.query().fetch(keys_only=True))

        self.json['status'] = 'Deleted'

    def purgeAll(self):
        self.purge('user')
        self.purge('game')