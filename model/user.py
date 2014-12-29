from google.appengine.ext import ndb

import datetime
import random
import math

from model.queue import Queue

# Represents a user session
#
# This stores the user information / resources / stats for a given user
# during a game
class User(ndb.Model):

    # If the player doesn't specify their name, one will be
    # automatically generated by randomly selecting a first and last
    # name.
    #
    # EG: Pessimistic Wizard, Lazy Student, Incredible Bolt, etc...
    DEFAULT_FIRST_NAMES  = [
        'Red', 'Blue', 'Computer Science', 'Dark', 'Pessimistic',
        'Lazy', 'Yellow', 'Incredible'
    ]
    DEFAULT_SECOND_NAMES = ['Otter', 'Bolt', 'Student', 'Wizard']

    # These are the human readable names for the player's level
    LEVEL_NAMES = [
        "Hamlet", "Village", "Town", "City", "Metropolis", "Magapolis"
    ]

    # The user ID
    uid  = ndb.StringProperty()

    # The user's name (human readable)
    name = ndb.StringProperty()

    # The game this user is a member of
    gid  = ndb.StringProperty()

    # Map of their city
    homeMap = ndb.StringProperty(indexed = False)

    # Which tile their settlement is on
    positionOnMap = ndb.IntegerProperty()

    # The last time their values were updated
    lastUpdated = ndb.DateTimeProperty(auto_now_add=True)

    # If a building is being built at the moment, its name will be here
    buildingQueue = ndb.StringProperty()

    # The time that the building will have completed
    buildingFinish = ndb.DateTimeProperty()

    # If a building is being built at the moment, its name will be here
    levelingQueue = ndb.StringProperty()

    # The time that the building will have completed
    levelingFinish = ndb.DateTimeProperty()

    # What level their city has reached:
    #   0 = Hamlet
    #   1 = Village
    #   2 = Town
    #   3 = City
    #   4 = Metropolis
    #   5 = Magapolis
    level = ndb.IntegerProperty(default=1)

    # How much Gold the user has
    gold = ndb.FloatProperty(default=50)

    # How much Food the user has
    food = ndb.FloatProperty(default=200)

    # How much Wood the user has
    wood = ndb.FloatProperty(default=200)

    # How much Stone the user has
    stone = ndb.FloatProperty(default=200)

    # The level of their home
    homeLvl = ndb.IntegerProperty(default=1)

    # The number of people at the home
    peopleAtHome = ndb.IntegerProperty(default=50)

    # How many houses the player has
    houses = ndb.IntegerProperty(default=1)

    # Has this player got a trade centre?
    trade = ndb.BooleanProperty(default=False)

    # The number of people at the trade centre
    peopleAtTrade = ndb.IntegerProperty(default=0)

    # Has this player got a grapevine?
    grapevine = ndb.BooleanProperty(default=False)

    # The number of people at the grapevine
    peopleAtGrapevine = ndb.IntegerProperty(default=0)

    # Has this player got storage?
    storage = ndb.BooleanProperty(default=False)

    # The level of the storage
    storageLvl = ndb.IntegerProperty(default=1)

    # Has this player got a military centre?
    military = ndb.BooleanProperty(default=False)

    # The level of the military
    militaryLvl = ndb.IntegerProperty(default=1)

    # Number of people at the military centre
    peopleAtMilitary = ndb.IntegerProperty(default=0)

    # How many mines has this player got?
    mines = ndb.IntegerProperty(default=0)

    # There is a chance that a mine will yield gold. How many gold mines
    # has the user got?
    goldMines = ndb.IntegerProperty(default=0)

    # The level of the mines
    mineLvl = ndb.IntegerProperty(default=1)

    # Number of people at the mines
    peopleAtMine = ndb.IntegerProperty(default=0)

    # How many lumberjacks has this player got?
    lumberjacks = ndb.IntegerProperty(default=0)

    # The level of the lumberjacks
    lumberjackLvl = ndb.IntegerProperty(default=1)

    # Number of people at the lumberjacks
    peopleAtLumberjack = ndb.IntegerProperty(default=0)

    # How many docks has this player got?
    docks = ndb.IntegerProperty(default=0)

    # The level of the docks
    dockLvl = ndb.IntegerProperty(default=1)

    # Number of people at the docks
    peopleAtDock = ndb.IntegerProperty(default=0)

    def addQueue(self, queue, secs):
        queue.finish = self.lastUpdated + datetime.timedelta(seconds = secs)
        queue.uid    = self.uid

    def finishQueue(self, queue):

        timeDelta = queue.finish - self.lastUpdated
        name      = queue.name
        number    = 1
        self.runUpdate(timeDelta.total_seconds())

        self.lastUpdated = queue.finish

        if queue.queueType == Queue.TYPE_BUILD:
            if name in ['trade', 'storage', 'military', 'grapevine']:
                setattr(self, name, True)
                return
            # Everything else has variable numbers, so get the current
            # number and add one to it
            else:
                name = name + 's'
        elif queue.queueType == Queue.TYPE_LEVEL:
            name = name + 'Lvl'
        elif queue.queueType == Queue.TYPE_PEOPLE:
            name = 'peopleAt' + name.capitalize()

        setattr(self, name, getattr(self, name) + queue.number)

    # Recalculates all the resouces since the last update, and sets
    # the last update timestamp to now()
    #
    # If any building / leveling up occured during this time, it will
    # also take that into account. For example, say the user has 1 mine,
    # and was last updated 3 minutes ago, however they were also
    # building a mine, which finished 2 minutes ago. This method will
    # give the user:
    #     (1 minute  of stone as produced by 1 mine)
    #   + (2 minutes of stone as produced by 2 mines)
    #
    # In a more complex example: the user has 1 mine of level 1, and was
    # updated 10 minutes ago. They were leveling up to mines level 2,
    # which finished 7 minutes ago, and buidling a new mine, which
    # finished 1 minute ago. They will get:
    #     (3 minutes of stone as produced by 1 mine,  level 1)
    #   + (6 minutes of stone as produced by 1 mine,  level 2)
    #   + (1 minute  of stone as produced by 2 mines, level 2) 
    def updateValues(self):

        queues = Queue.query(
            Queue.uid == self.uid,
            Queue.finish <= datetime.datetime.now()
        )

        for queue in queues.order(Queue.finish).fetch():
            self.finishQueue(queue)
            queue.key.delete()
        
        # Calculate the change of resources since now and the time we
        # were last updated
        dt = datetime.datetime.now()
        self.runUpdate((dt - self.lastUpdated).total_seconds())

        self.lastUpdated = dt

    # Checks if a queue exists and has finished
    def queueFinished(self, queue):
        return getattr(self, queue + 'ingQueue') \
            and self.getQueueFinished(queue) <= 0

    # Calculates the resource gains in the given amount of time and adds
    # these to the user's account
    def runUpdate(self, secs):
        self.food +=                                     \
              (self.peopleAtDock * self.level)           \
            * secs / 60.0
        self.food +=                                     \
              (self.peopleAtGrapevine * self.level)      \
            * secs / 60.0
        self.wood +=                                     \
              (random.randrange(1, 19) / 10.0) * 0.3     \
            * self.lumberjackLvl                         \
            * self.peopleAtLumberjack                    \
            * self.lumberjacks                           \
            * secs / 60.0
        self.stone +=                                    \
              (random.randrange(1, 19) / 10.0) * 0.3     \
            * self.mineLvl                               \
            * self.peopleAtMine                          \
            * self.mines                                 \
            * secs / 60.0
        self.gold +=                                     \
              (random.randrange(1, 19) / 10.0) * 0.3     \
            * self.mineLvl                               \
            * self.peopleAtMine                          \
            * self.goldMines                             \
            * secs / 60.0

    # The Queue Finished time is stored in the database as a timestamp.
    # This takes a value in seconds and creates a timestamp from it,
    # x seconds away from now
    def setQueueFinished(self, queue, secs):
        setattr(self, queue + 'ingFinish',
            self.lastUpdated + datetime.timedelta(seconds = secs)
        )

    # Returns the number of seconds until the building in the given
    # queue is complete
    def getQueueFinished(self, queue):
        dt = datetime.datetime.now()
        return (getattr(self, queue + 'ingFinish') - dt).total_seconds()

    # Returns true / false depending on whether the user has the given
    # type of building
    def hasBuilding(self, building):
        if building == 'home':
            return True
        elif building in ['trade', 'storage', 'military', 'grapevine']:
            return getattr(self, building)
        else:
            return bool(getattr(self, building + 's'))

    # Takes a game object as created / returned from the database, and
    # converts it into a dict, with only public facing properties being
    # added
    def toDict(self):
        return {
            "level" : User.LEVEL_NAMES[self.level - 1],
            "position" : self.positionOnMap,
            "resources" : {
                "gold"  : math.floor(self.gold),
                "food"  : math.floor(self.food),
                "wood"  : math.floor(self.wood),
                "stone" : math.floor(self.stone)
            },
            "buildings" : {
                "home"        : {
                    "num"    : 1,
                    "level"  : self.homeLvl,
                    "people" : self.peopleAtHome
                },
                "house"       : {
                    "num" : self.houses
                },
                "trade"       : {
                    "num"    : 1 if self.trade else 0,
                    "people" : self.peopleAtTrade
                },
                "grapevine"   : {
                    "num"    : 1 if self.grapevine else 0,
                    "people" : self.peopleAtGrapevine
                },
                "storage"    : {
                    "num"   : 1 if self.storage else 0,
                    "level" : self.storageLvl
                },
                "military"    : {
                    "num"    : 1 if self.military else 0,
                    "level " : self.militaryLvl,
                    "people" : self.peopleAtMilitary
                },
                "mine"        : {
                    "num"    : self.mines,
                    "level"  : self.mineLvl,
                    "people" : self.peopleAtMine
                },
                "lumberjack"  : {
                    "num"    : self.lumberjacks,
                    "level"  : self.lumberjackLvl,
                    "people" : self.peopleAtLumberjack
                },
                "dock"        : {
                    "num"    : self.docks,
                    "level"  : self.dockLvl,
                    "people" : self.peopleAtDock
                }
            }
        }