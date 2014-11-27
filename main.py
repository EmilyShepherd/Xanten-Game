#!/usr/bin/env python
#
# CAD Team M Group Project
#

import webapp2

# Handlers
from handler.game_handler import GameHandler
from handler.me_handler   import MeHandler

# REMOVE IN MAIN RELEASE
from handler.debug_handler import DebugHandler

# Setup routes
app = webapp2.WSGIApplication([
    webapp2.Route(r'/game/<gid>',         handler=GameHandler, handler_method='get_game'),
    webapp2.Route(r'/game/<gid>/',        handler=GameHandler, handler_method='get_game'),
    webapp2.Route(r'/game/',              handler=GameHandler,                          methods=['GET']),
    webapp2.Route(r'/game/<gid>/start',   handler=GameHandler, handler_method='start'),
    webapp2.Route(r'/game/<gid>/join',    handler=GameHandler, handler_method='join'),
    webapp2.Route(r'/game/<gid>/before',  handler=GameHandler, handler_method='start'),
    webapp2.Route(r'/game/',              handler=GameHandler, handler_method='create', methods=['PUT']),

    webapp2.Route(r'/me/people/move',        handler=MeHandler, handler_method='movePeople', methods=['POST']),    
    webapp2.Route(r'/me/building/<bname>/<queue>', handler=MeHandler, handler_method='addBuildingToQueue', methods=['GET']),

    # REMOVE IN MAIN RELEASE 
    webapp2.Route(r'/debug/me',            handler=DebugHandler, handler_method='me'),
    webapp2.Route(r'/debug/purge/<table>', handler=DebugHandler, handler_method='purge'),
    webapp2.Route(r'/debug/purge/',        handler=DebugHandler, handler_method='purgeAll'),
    webapp2.Route(r'/debug/purge',         handler=DebugHandler, handler_method='purgeAll')
], debug=True) #REMOVE IN MAIN RELEASE
