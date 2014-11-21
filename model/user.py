from google.appengine.ext import ndb

# Represents a user session
#
# This stores the user information / resources / stats for a given user
# during a game
class User(ndb.Model):

    # The user ID
    uid  = ndb.StringProperty()

    # The user's name (human readable)
    name = ndb.StringProperty()

    # The game this user is a member of
    gid  = ndb.StringProperty()