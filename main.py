#!/usr/bin/env python
#
# CAD Team M Group Project
#

import webapp2 as w

# Handlers
from handler.game_handler import GameHandler
from handler.me_handler   import MeHandler
#from handler.military_hander   import MilitaryHandler

# The name for the classes are quite long, so put them into a variable
# so the list of routes doesn't go over the desired line length
gameClass     = 'handler.game_handler.GameHandler'
meClass       = 'handler.me_handler.MeHandler'
militaryClass = 'handler.military_handler.MilitaryHandler'
tradeClass    = 'handler.trade_handler.TradeHandler'

# Setup routes
app = w.WSGIApplication([
    w.Route('/game/cron',        gameClass + ':cron'),

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
        '/me/people/create',
        meClass + ':createPeople',
        methods=['POST']
    ),    
    w.Route(
        '/me/building/<bname>/<queue>',
        meClass + ':addBuildingToQueue',
        methods=['GET']
    ),

    w.Route(
        '/military/attack/<city>/<num>',
        militaryClass + ':attack',
        methods=['GET']
    ),    
    w.Route(
        '/military/send/<city>/<num>',
        militaryClass + ':send',
        methods=['GET']
    ),

    w.Route(
        '/trade/perform/<tid>',
        tradeClass + ':perform',
        methods=['POST']
    ),
], debug=False) #REMOVE IN MAIN RELEASE
