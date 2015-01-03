from google.appengine.ext import ndb

import datetime
import random
import math

# Represents a queue
#
# This stores a task that takes a certain amount of time to complete
class Queue(ndb.Model):

    # Types of queue
    #   Level  - for leveling up
    #   Build  - For building something
    #   People - For training people
    TYPE_LEVEL  = 'level'
    TYPE_BUILD  = 'build'
    TYPE_PEOPLE = 'people'

    # The ID of the user that is performing this task
    uid = ndb.StringProperty()

    # The name of the thing being built / leveled up / trained
    name = ndb.StringProperty()

    # The type of queue this is (level / build / people)
    queueType = ndb.StringProperty()

    # The datetime that this task will be complete
    finish = ndb.DateTimeProperty()

    # When training people, this represents the number of people being
    # trained
    #
    # NB: Other queue types will still honour this, so if you wanted to
    # have a queue with 2 buildings in it, that would be conceivably
    # possible
    number = ndb.IntegerProperty(default=1)

    # Calculates the number of seconds until this queue will be complete
    def secsToFinish(self):
        return (self.finish - datetime.datetime.now()).total_seconds()

    # Calculates the number of seconds since this queue completed
    def secsSinceFinish(self):
        return -1 * self.secsToFinish()

    # Returns true if the queue has completed
    def isFinished(self):
        return self.finish <= datetime.datetime.now()

    # Returns the queue as a dictionary, for sending via JSON to the
    # client. This contains:
    #   + The queue name
    #   + The queue type
    #   + The number of seconds until it is completed
    def toDict(self):
        return {
            "name"        : self.name,
            "type"        : self.queueType,
            "secondsLeft" : self.secsToFinish()
        }