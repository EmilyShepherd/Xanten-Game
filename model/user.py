from google.appengine.ext import ndb

import datetime

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
    homeMap = ndb.StringProperty()

    # The last time their values were updated
    lastUpdated = ndb.DateTimeProperty(auto_now_add=True)

    # What level their city has reached:
    #   0 = Hamlet
    #   1 = Village
    #   2 = Town
    #   3 = City
    #   4 = Metropolis
    #   5 = Magapolis
    level = ndb.IntegerProperty(default=1)

    # How much Gold the user has
    gold = ndb.IntegerProperty(default=50)

    # How much Food the user has
    food = ndb.IntegerProperty(default=200)

    # How much Wood the user has
    wood = ndb.IntegerProperty(default=200)

    # How much Stone the user has
    stone = ndb.IntegerProperty(default=200)

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

    # Sets the lastUpdated property with the current datetime, without
    # seconds saved. It also calculates the number of minutes since the
    # last update
    def markUpdate(self):
        realDT = datetime.datetime.now()

        # Gets the datetime now, without the seconds
        dt     = datetime.datetime(
            realDT.year,
            realDT.month,
            realDT.day,
            realDT.hour,
            realDT.minute
        )

        minutes = (dt - self.lastUpdated).total_seconds() / 60

        self.lastUpdated = dt

        return minutes