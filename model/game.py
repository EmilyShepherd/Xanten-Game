from google.appengine.ext import ndb

# Represents a Game
#
# This stores information about the game, such as who is playing
class Game(ndb.Model):

    # If the player doesn't specify the game's name, one will be
    # automatically generated by randomly selecting a first and last
    # name.
    #
    # EG: Spontaneous Happenings, Pessimistic Escapade, etc...
    DEFAULT_FIRST_NAMES  = [
        'Spontaneous', 'Terrifying', 'Dark', 'Pessimistic', 'Whacky',
        'Incredible'
    ]
    DEFAULT_SECOND_NAMES = [
        'Escapade', 'Events', 'Happenings', 'Procrastination'
    ]

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

    # The maximum number of players entitled to sign up to this game
    maxPlayers = ndb.IntegerProperty()

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
        game['nrOfPlayers'] = len(self.members)

        return game