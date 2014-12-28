#!/usr/bin/env python
#
# CAD Team M Group Project
#

import webapp2 as w

# Handlers
from handler.game_handler import GameHandler
from handler.me_handler   import MeHandler

# The name for the classes are quite long, so put them into a variable
# so the list of routes doesn't go over the desired line length
gameClass = 'handler.game_handler.GameHandler'
meClass   = 'handler.me_handler.MeHandler'

# REMOVE IN MAIN RELEASE
from handler.debug_handler import DebugHandler

# Setup routes
app = w.WSGIApplication([
    # End points relating to creating / joining / starting games
    w.Route('/game/',            gameClass,             methods=['GET']),
    w.Route('/game/',            gameClass + ':create', methods=['PUT']),
    w.Route('/game/<gid>',       gameClass + ':get_game'),
    w.Route('/game/<gid>/',      gameClass + ':get_game'),
    w.Route('/game/<gid>/start', gameClass + ':start'),
    w.Route('/game/<gid>/join',  gameClass + ':join'),

    # End points relating to player actions on their city during a game
    w.Route(
        '/me/people/move',
        meClass + ':movePeople',
        methods=['POST']
    ),    
    w.Route(
        '/me/building/<bname>/<queue>',
        meClass + ':addBuildingToQueue',
        methods=['GET']
    ),

    # REMOVE IN MAIN RELEASE 
    w.Route('/debug/me',            handler=DebugHandler, handler_method='me'),
    w.Route('/debug/purge/<table>', handler=DebugHandler, handler_method='purge'),
    w.Route('/debug/purge/',        handler=DebugHandler, handler_method='purgeAll'),
    w.Route('/debug/purge',         handler=DebugHandler, handler_method='purgeAll'),
    w.Route('/debug/login',         handler=DebugHandler, handler_method='login'),
    w.Route('/debug/test',         handler=DebugHandler, handler_method='test')

], debug=True) #REMOVE IN MAIN RELEASE
