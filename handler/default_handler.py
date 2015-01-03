import webapp2
import json
import random
from google.appengine.api import channel

# Model
from model.user import User

# Handles all requests
#
# Extending classes should add their return values to self.json which
# will be automatically sent at the end
class DefaultHandler(webapp2.RequestHandler):

    # Sets the content type to application/json and creates a blank
    # json property
    def __init__(self, request, response):
        super(DefaultHandler, self).__init__(request, response)

        self.response.content_type = 'application/json'
        self.json = { };

    # Serialises the json property to a JSON string and sends it
    def __del__(self):
        self.response.write(json.dumps(self.json))

    # Sets the response status to "ERROR" and sets the message to be the
    # given param
    def stderr(self, msg):
        self.json['status']  = 'error'
        self.json['message'] = msg

    # Returns true or false, depending if the user is logged on
    #
    # If the user is found to be logged in, self.user will be populated
    # with a user object for the session
    def checkLogin(self, showError=True):
        sid = self.request.cookies.get('Session')

        # Check if a "Session" cookie was set
        if not sid:
            if showError:
                self.stderr('You are not logged in')
            return False
        else:
            # Check if this user session exists
            query = User.query(User.uid == sid)
            if query.count() != 1:
                if showError:
                    self.stderr('You are not logged in')
                return False
            else:
                # Passed all tests. Get the user
                self.user = query.fetch(1)[0]
                return True

    # Attempts to get a POST value. If none was set, or it was blank, it
    # picks random value from the defaults provided
    #
    # WARNING: Only use this if you *know* the method is POST / PUT.
    # This method will throw an exception if the method is GET
    def getPOSTorRandom(self, key, className):
        value = self.request.POST.get(key, None)

        if value:
            return value
        else:
            first  = self.getRand(className.DEFAULT_FIRST_NAMES)
            second = self.getRand(className.DEFAULT_SECOND_NAMES)
            return first + ' ' + second

    # Helper function used by getPOSTorRandom
    #
    # This function returns a random value out of the given array
    def getRand(self, arr):
        return arr[random.randrange(0, len(arr))]

    # Sends a message to the current user, using the GAE channel API
    def sendMessage(self, call, data):
        self.sendMessageTo(self.user, call, data)

    # Sends a message to the given user, using the GAE channel API
    def sendMessageTo(self, user, call, data):
        msg = {
            "call" : call,
            "data" : data
        }

        channel.send_message(user.uid, json.dumps(msg))