import webapp2
import uuid
import datetime

from default_handler import DefaultHandler

# Models
from model.game import Game
from model.user import User
from model.map import Map

# Handles /game/* requests
#
class GameHandler(DefaultHandler):

    # PUT /game/
    #
    # Creates a game
    def create(self):
        gMap            = Map.convertToWorldMap(self.request.POST['game_map'])
        game            = Game(gid = uuid.uuid4().hex)
        game.name       = self.getPOSTorRandom('game_name', Game)
        game.gmap       = gMap.toString()
        game.maxPlayers = Map.countInhabitalSpace(game.gmap);
        game.private    = False if self.request.POST['game_type'] == 'public' else True
        game.owner      = self.join_game(game, self.getPOSTorRandom('game_user', User))
        game.put()

        self.json    = game.toDict()

    # GET /game/
    #
    # Returns a list of games
    def get(self):
        self.json['games'] = [ ]
        query              = Game.query(
            Game.private == False,
            Game.running == False
        )

        for game in query.fetch():
            # Only show games which aren't full
            if len(game.members) < game.maxPlayers:
                self.json['games'].append(game.toDict())

    # GET /game/<gid>
    #
    # Gets the user list and status for a game
    def get_game(self, gid):
        query = Game.query(Game.gid == gid)

        # Look for the game
        if query.count() != 1:
            self.stderr('Unknown Game')
        else:
            game = query.fetch(1)[0]

            self.json['status'] = 'running' if game.running else 'waiting'
            self.json['full']   = (len(game.members) >= game.maxPlayers)
            self.json['users']  = game.members

            if game.running and self.checkLogin(False):
                self.json['player'] = self.user.toDict()

    # POST /game/<gid>/join
    #
    # Joins a game
    def join(self, gid):
        query = Game.query(Game.gid == gid)
        name  = self.getPOSTorRandom('username', User)

        # Look for the game
        if query.count() != 1:
            self.stderr('Unknown Game')
        else:
            game = query.fetch(1)[0]

            if game.running:
                self.stderr('Game has started')
            elif len(game.members) >= game.maxPlayers:
                self.stderr('The maximum number of players has been reached')
            elif User.query(User.name==name, User.gid==gid).count() != 0:
                self.stderr('Username already exists')
            else:
                sid = self.join_game(game, name)
                game.put()

                self.json['status']  = 'joined'

                # Not sure why either of these are needed
                self.json['token']   = game.gid
                self.json['session'] = sid

    # GET /game/<gid>/start
    #
    # Starts a game
    #
    # NB: You need to be the owner of a game to start it
    def start(self, gid):

        # You must be the owner of a game to start it, so we should
        # check if they are loged on
        if not self.checkLogin(): return

        query = Game.query(Game.gid == gid)

        if query.count() != 1:
            self.stderr('Unknown Game')
        else:
            game = query.fetch(1)[0]

            if game.owner != self.user.uid:
                self.stderr('You are not authorised to start this game')
            else:
                game.running = True

                # Pick places for each of the players and set their
                # lastUpdated value to the start of the game so they can
                # load resources
                mapObj = Map(game.gmap)
                for user in User.query(User.gid == game.gid).fetch():
                    user.positionOnMap = mapObj.pickRandomTile(user)
                    user.lastUpdated   = datetime.datetime.now()
                    user.put()

                game.gmap = mapObj.toString()
                game.put()

                self.json['status'] = 'started'
                self.json['player'] = self.user.toDict()
                self.json['maps']   = {
                    "world" : mapObj.toDict()
                }

    # Used by join() and create() to create a new User session and sign
    # them up to the given game
    def join_game(self, game, name):
        sess      = User(uid = uuid.uuid4().hex)
        sess.gid  = game.gid;
        sess.name = name
        sess.put()

        self.response.set_cookie('Session', sess.uid)

        # We don't need to save this as create() has more stuff to add
        game.members.append(sess.name)

        # The userid
        return sess.uid