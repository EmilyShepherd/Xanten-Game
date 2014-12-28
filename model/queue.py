from google.appengine.ext import ndb

import datetime
import random
import math

# Represents a user session
#
# This stores the user information / resources / stats for a given user
# during a game
class Queue(ndb.Model):

    TYPE_LEVEL  = 'level';
    TYPE_BUILD  = 'build';
    TYPE_PEOPLE = 'people';

    uid = ndb.StringProperty()

    name = ndb.StringProperty()

    queueType = ndb.StringProperty()

    finish = ndb.DateTimeProperty()

    number = ndb.IntegerProperty(default=1)

    def secsToFinish(self):
        return (self.finish - datetime.datetime.now()).total_seconds()

    def secsSinceFinish(self):
        return -1 * self.secsToFinish()

    def isFinished(self):
        return self.finish <= datetime.datetime.now()

    def toDict(self):
        return {
            "name"        : self.name,
            "type"        : self.queueType,
            "secondsLeft" : self.secsToFinish()
        }