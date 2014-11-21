#!/usr/bin/env python
#
# CAD Team M Group Project
#

import webapp2
import json
from google.appengine.ext import ndb
import uuid

class User(ndb.Model):
    id = ndb.IntegerProperty()
    name = ndb.StringProperty()

class Game(ndb.Model):
    gid = ndb.IntegerProperty()
    name = ndb.StringProperty()
    members = ndb.IntegerProperty(repeated=True)
    user = ndb.StringProperty()
    private = ndb.BooleanProperty(default=True)
    gmap = ndb.StringProperty()
    token = ndb.StringProperty()

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
    def start(self, id):
        self.json['id'] = id
        self.json['status'] = 'started'
        self.json['req'] = self.request.headers['User-Agent']

    # GET /game/join/<id>
    #
    # Joins a game
    def join(self, id):
        self.json['id'] = id
        self.json['status'] = 'joined'

    # GET /game/before/<id>
    #
    # 
    def before(self, id):
        self.json['id'] = id
        self.json['status'] = 'ok'

    # PUT /game/
    #
    # Creates a game
    def create(self):
        game = Game(gid = Game.query().count())
        game.name = self.request.POST['game_name']
        game.user = self.request.POST['game_user']
        game.gmap  = self.request.POST['game_map']
        game.private = False if self.request.POST['game_type'] == 'public' else True
        game.token = uuid.uuid4().hex
        game.put()
        self.json['status'] = 'created'
        self.json['game'] = self.gameToDict(game)

    def gameToDict(self, oGame):
        game = { }
        game['token'] = oGame.token
        game['name'] = oGame.name
        game['type'] = 'Private' if oGame.private == True else 'Public'
        game['session'] = 1

        return game

# Setup routes
app = webapp2.WSGIApplication([
    webapp2.Route(r'/user',             handler=UserHandler),
    webapp2.Route(r'/game/',            handler=GameHandler,                          methods=['GET']),
    webapp2.Route(r'/game/start/<id>',  handler=GameHandler, handler_method='start'),
    webapp2.Route(r'/game/join/<id>',   handler=GameHandler, handler_method='join'),
    webapp2.Route(r'/game/before/<id>', handler=GameHandler, handler_method='start'),
    webapp2.Route(r'/game/',            handler=GameHandler, handler_method='create', methods=['PUT'])
], debug=True)
