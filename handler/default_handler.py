import webapp2
import json
import random

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
    def checkLogin(self):
        sid = self.request.cookies.get('Session')

        # Check if a "Session" cookie was set
        if not sid:
            self.stderr('You are not logged in')
            return False
        else:
            # Check if this user session exists
            query = User.query(User.uid == sid)
            if query.count() != 1:
                self.stderr('You are not logged in')
                return False
            else:
                self.user = query.fetch(1)[0]
                return True

    def getPOSTorRandom(self, key, className):
        value = self.request.POST.get(key, None)

        if value:
            return value
        else:
            first  = self.getRand(className.DEFAULT_FIRST_NAMES)
            second = self.getRand(className.DEFAULT_SECOND_NAMES)
            return first + ' ' + second

    def getRand(self, arr):
        return arr[random.randrange(0, len(arr))]