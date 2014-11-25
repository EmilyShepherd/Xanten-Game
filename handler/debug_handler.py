from google.appengine.ext import ndb

from default_handler import DefaultHandler

from model.game import Game
from model.user import User

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

        self.json['status'] = 'Deleted'

    # GET /debug/purge
    #
    # Deletes all data in all tables
    def purgeAll(self):
        self.purge('user')
        self.purge('game')

    # GET /debug/me
    #
    # This method simply returns a JSON array of all the user's details.
    # It includes values such as their resource levels, and what
    # buildings they have
    def me(self):

        # Have to be loged in
        if not self.checkLogin(): return

        self.user.updateValues(False)

        self.json = self.user.toDict()