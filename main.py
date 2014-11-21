#!/usr/bin/env python
#
# CAD Team M Group Project
#

import webapp2
import json
from google.appengine.ext import ndb
import uuid

class User(ndb.Model):
    uid = ndb.StringProperty()
    name = ndb.StringProperty()
    gid = ndb.StringProperty()

class Game(ndb.Model):
    gid = ndb.StringProperty()
    name = ndb.StringProperty()
    members = ndb.StringProperty(repeated=True)
    owner = ndb.StringProperty()
    private = ndb.BooleanProperty(default=True)
    gmap = ndb.StringProperty()
    running = ndb.BooleanProperty(default=False)

# Handles all requests
#
# Extending classes should add their return values to self.json which
# will be automatically sent at the end
class DefaultHandler(webapp2.RequestHandler):

    # Sets the content type to application/json and creates a blank
    # json property
    def __init__(self, request, response):
        super(DefaultHandler, self).__init__(request, response)

        self.response.content_type = 'application/json'
        self.json = { };

    # Serialises the json property to a JSON string and sends it
    def __del__(self):
        self.response.write(json.dumps(self.json))

    def stderr(self, msg):
        self.json['status']  = 'ERROR'
        self.json['message'] = msg

class UserHandler(DefaultHandler):

    # /user/
    def get(self):
        self.json['test'] = 'foo'

class GameHandler(DefaultHandler):

    # GET /game/
    #
    # Returns a list of games
    def get(self):
        self.json['games'] = [ ]
        for game in Game.query(Game.private==False).fetch():
            self.json['games'].append(self.gameToDict(game))

    # GET /game/start/<id>
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

    # POST /game/join/<id>
    #
    # Joins a game
    def join(self, gid):
        query = Game.query(Game.gid==gid)
        name  = self.request.POST['user']

        if query.count() != 1:
            self.stderr('Unknown Game')
        else:
            if User.query(User.name==name, User.gid==gid).count() != 0:
                self.stderr('Username already exists')
            else:
                game = query.fetch(1)[0]
                self.join_game(game, name)
                game.put()
                self.json = self.gameToDict(game)

    def join_game(self, game, name):
        sess      = User(uid = uuid.uuid4().hex)
        sess.gid  = game.gid;
        sess.name = name
        game.members.append(sess.uid)
        sess.put()

        self.response.set_cookie('Session', sess.uid)

        return sess.uid

    # GET /game/before/<id>
    #
    # 
    def before(self, id):
        self.json['id']     = id
        self.json['status'] = 'ok'

    def get_game(self, gid):
        query = Game.query(Game.gid == gid)

        if query.count() != 1:
            self.stderr('Unknown Game')
        else:
            game = query.fetch(1)[0]

            self.json['status'] = 'running' if game.running else 'waiting'
            self.json['users']  = [ ]

            for uid in game.members:
                user = User.query(User.uid == uid).fetch(1)[0]
                self.json['users'].append(user.name)

    # PUT /game/
    #
    # Creates a game
    def create(self):
        game         = Game(gid = uuid.uuid4().hex)
        game.name    = self.request.POST['game_name']
        game.gmap    = self.request.POST['game_map']
        game.private = False if self.request.POST['game_type'] == 'public' else True
        game.owner   = self.join_game(game, self.request.POST['game_user'])
        game.put()

        self.json    = self.gameToDict(game)

    # Takes a game object as created / returned from the database, and
    # converts it into a dict, with only public facing properties being
    # added
    def gameToDict(self, oGame):
        game = { }
        game['token']   = oGame.gid
        game['name']    = oGame.name
        game['type']    = 'Private' if oGame.private == True else 'Public'

        return game

    def checkLogin(self):
        sid = self.request.cookies.get('Session')
        if not sid:
            self.stderr('You are not logged in')
            return False
        else:
            query = User.query(User.uid == sid)
            if query.count() != 1:
                self.stderr('You are not logged in')
                return False
            else:
                self.user = query.fetch(1)[0]
                return True

# Setup routes
app = webapp2.WSGIApplication([
    webapp2.Route(r'/game/<gid>',        handler=GameHandler, handler_method='get_game'),
    webapp2.Route(r'/game/',             handler=GameHandler,                          methods=['GET']),
    webapp2.Route(r'/game/<gid>/start',  handler=GameHandler, handler_method='start'),
    webapp2.Route(r'/game/<gid>/join',   handler=GameHandler, handler_method='join'),
    webapp2.Route(r'/game/<gid>/before', handler=GameHandler, handler_method='start'),
    webapp2.Route(r'/game/',             handler=GameHandler, handler_method='create', methods=['PUT'])
], debug=True)
