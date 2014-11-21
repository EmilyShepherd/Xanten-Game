from google.appengine.ext import ndb

class Game(ndb.Model):
    # The ID of the game (refered to as "token" by the js side)
    gid     = ndb.StringProperty()

    # User's name (human readable)
    name    = ndb.StringProperty()

    # The list of uids that are playing this game
    members = ndb.StringProperty(repeated=True)

    # The uid of the user that created the game
    owner   = ndb.StringProperty()

    # Is this a private game?
    private = ndb.BooleanProperty(default=True)

    # String representation of the map
    #
    # This isn't indexed because it's large(ish) and is never searched
    gmap    = ndb.StringProperty(indexed=False)

    # Is this game running? The alternative is "waiting", which means
    # users can still sign up
    running = ndb.BooleanProperty(default=False)

    # Takes a game object as created / returned from the database, and
    # converts it into a dict, with only public facing properties being
    # added
    def toDict(self):
        game = { }
        game['token']       = self.gid
        game['name']        = self.name
        game['type']        = 'Private' if self.private == True else 'Public'
        game['nrOfPlayers'] = len(self.members)

        return game