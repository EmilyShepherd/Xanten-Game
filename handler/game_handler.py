import webapp2
import uuid

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
        game            = Game(gid = uuid.uuid4().hex)
        game.name       = self.getPOSTorRandom('game_name', Game)
        game.gmap       = self.request.POST['game_map']
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
        for game in Game.query(Game.private==False, Game.running==False).fetch():
            if len(game.members) < game.maxPlayers:
                self.json['games'].append(game.toDict())

    # GET /game/<gid>
    #
    # Gets the user list and status for a game
    def get_game(self, gid):
        query = Game.query(Game.gid == gid)

        if query.count() != 1:
            self.stderr('Unknown Game')
        else:
            game = query.fetch(1)[0]

            self.json['status'] = 'running' if game.running else 'waiting'
            self.json['full']   = (len(game.members) >= game.maxPlayers)
            self.json['users']  = [ ]

            for uid in game.members:
                user = User.query(User.uid == uid).fetch(1)[0]
                self.json['users'].append(user.name)

    # POST /game/<gid>/join
    #
    # Joins a game
    def join(self, gid):
        query = Game.query(Game.gid==gid)
        name = self.getPOSTorRandom('name', User)
        msg = ""
        status = 'error'
        if query.count() != 1:
            msg = 'Unknown Game'
        else:
            game = query.fetch(1)[0]

            if game.running:
                msg = 'Game has started'
            elif len(game.members) >= game.maxPlayers:
                msg = 'The maximum number of players has been reached'
            elif User.query(User.name==name, User.gid==gid).count() != 0:
                msg = 'Username already exists';
            else:
                self.join_game(game, name)
                game.put()
                status = 'joined'
                self.json['game'] = game.toDict() #his one should returns the token and session id
        self.json['status'] = status
        self.json['msg'] = msg

    # GET /game/<gid>/start
    #
    # Starts a game
    def start(self, gid):
        if not self.checkLogin():
            return

        query = Game.query(Game.gid==gid)

        if query.count() != 1:
            self.stderr('Unknown Game')
        else:
            game = query.fetch(1)[0]

            if game.owner != self.user.uid:
                self.stderr('You are not authorised to start this game')
            else:
                game.running = True
                game.put()

                self.json['status'] = 'started'

    # GET /game/before/<gid>
    #
    # 
    def before(self, id):
        self.json['id']     = id
        self.json['status'] = 'ok'

    # Used by join() and create() to create a new User session and
    # sign them up to the given game
    def join_game(self, game, name):
        sess      = User(uid = uuid.uuid4().hex)
        sess.gid  = game.gid;
        sess.name = name
        game.members.append(sess.uid)
        sess.put()

        self.response.set_cookie('Session', sess.uid)

        return sess.uid