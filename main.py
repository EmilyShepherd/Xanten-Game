#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import json
from google.appengine.ext import ndb

class User(ndb.Model):
    id = ndb.IntegerProperty()
    name = ndb.StringProperty()

class Game(ndb.Model):
    id = ndb.IntegerProperty()
    name = ndb.StringProperty()
    members = ndb.IntegerProperty(repeated=True)

class JSONHandler(webapp2.RequestHandler):
    def __init__(self, request, response):
        super(JSONHandler, self).__init__(request, response)

        self.response.content_type = 'application/json'
        self.json = { };

    def __del__(self):
        self.response.write(json.dumps(self.json))

class UserHandler(JSONHandler):

    # /user/
    def get(self):
        self.json['test'] = 'foo'

class GameHandler(JSONHandler):

    # GET /game/
    #
    # Returns a list of games
    def get(self):
        self.json['games'] = { }

    # GET /game/start/<id>
    #
    # Starts a game
    def start(self, id):
        self.json['id'] = id
        self.json['status'] = 'started'

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
        self.json['status'] = 'created'
        self.json['id'] = 13

app = webapp2.WSGIApplication([
    webapp2.Route(r'/user',             handler=UserHandler),
    webapp2.Route(r'/game/',            handler=GameHandler,                          methods=['GET']),
    webapp2.Route(r'/game/start/<id>',  handler=GameHandler, handler_method='start'),
    webapp2.Route(r'/game/join/<id>',   handler=GameHandler, handler_method='join'),
    webapp2.Route(r'/game/before/<id>', handler=GameHandler, handler_method='start'),
    webapp2.Route(r'/game/',            handler=GameHandler, handler_method='create', methods=['PUT'])
], debug=True)
