from google.appengine.api import channel
import json

class Connection:
    
    # Sends a message to the given user, using the GAE channel API
    @staticmethod
    def sendMessageTo(user, call, data):
        msg = {
            "call" : call,
            "data" : data
        }

        channel.send_message(user.uid, json.dumps(msg))