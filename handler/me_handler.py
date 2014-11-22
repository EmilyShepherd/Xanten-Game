import webapp2
import uuid

from default_handler import DefaultHandler

# Models
from model.game import Game
from model.user import User
from model.map import Map

# Handles /me/* requests
#
class MeHandler(DefaultHandler):

    def get(self):
        if not self.checkLogin(): return

        self.updateValues()

        self.json['level']     = User.LEVEL_NAMES[self.user.level - 1]
        self.json['people']    = self.user.people
        self.json['resources'] = { }

        self.json['resources']['gold']  = self.user.gold
        self.json['resources']['food']  = self.user.food
        self.json['resources']['wood']  = self.user.wood
        self.json['resources']['stone'] = self.user.stone
        
        self.json['buildings'] = { }

        self.json['buildings']['home']       = {"num": 1, "level": self.user.homeLvl}
        self.json['buildings']['houses']     = {"num": self.user.houses}
        self.json['buildings']['trade']      = {"num": 1 if self.user.trade     else 0}
        self.json['buildings']['grapevine']  = {"num": 1 if self.user.grapevine else 0}
        self.json['buildings']['storage']    = {"num": 1 if self.user.storage   else 0}
        self.json['buildings']['storage']['level'] = self.user.storageLvl
        self.json['buildings']['military']   = {"num": 1 if self.user.military   else 0}
        self.json['buildings']['military']['level'] = self.user.militaryLvl
        self.json['buildings']['mine']       = {"num": self.user.mines}
        self.json['buildings']['mine']['level'] = self.user.mineLvl
        self.json['buildings']['lumberjack'] = {"num": self.user.lumberjacks}
        self.json['buildings']['lumberjack']['level'] = self.user.lumberjackLvl
        self.json['buildings']['dock']       = {"num": self.user.docks}
        self.json['buildings']['dock']['level'] = self.user.dockLvl

    def updateValues(self):
        pass