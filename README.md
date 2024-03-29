Xanten Game
===========

Cloud Application Development - Team M

API Structure
-------------

### POST /me/people/move
*Moves people from the given buildings*

#### Example:
```
POST /me/people/move

from=mine&to=lumberjack&number=5
```

#### Response:
```json
{
    "status" : "moved"
}
```
#### Possible Error Responses:
```json
{
    "status"      : "error",
    "message"     : "Number should be a positive integer" 
}
```

```json
{
    "status"      : "error",
    "message"     : "Unknown From Building"
}
```

```json
{
    "status"      : "error",
    "message"     : "Unknown To Building"
}
```

```json
{
    "status"      : "error",
    "message"     : "You don't have that kind of building"
}
```

```json
{
    "status"      : "error",
    "message"     : "You don't have that many people"
}
```

### GET /me/building/{bname}/{queue}
*Adds the given building to the given queue (build / level), assuming
there isn't anything else in it & you have enough monies*

#### Example:
`GET /me/building/dock/build`

#### Response:
```json
{
    "status"      : "Build Started",
    "building"    : "dock",
    "secondsLeft" : 600
}
```

#### Possible Error Responses:
```json
{
    "status"      : "error",
    "message"     : "You are already building",
    "building"    : "dock",
    "secondsLeft" : 600
}
```

```json
{
    "status"      : "error",
    "message"     : "Not enough resources!"
}
```

```json
{
    "status"      : "error",
    "message"     : "Unknown Building Type"
}
```

```json
{
    "status"      : "error",
    "message"     : "Unknown action: whateverQueueYouPassed"
}
```

### POST /game/
*Creates a new game with the given params*

#### Example:
```
PUT /game/

game_name=Lala&game_type=Public&game_user=Emily
```

#### Response:
```json
{
    "token"       : "6e1977af04f54c50842c8db621f5f020",
    "nrOfPlayers" : 3,
    "name"        : "Lala"
}
```

### GET /game/
*Lists all games which are waiting and public*

#### Example:
`GET /game/`

#### Response:
```json
{
    "games":
    [
        {
            "token"       : "6e1977af04f54c50842c8db621f5f020",
            "name"        : "Lala",
            "nrOfPlayers" : 3
        }
    ]
}
```

### GET /game/{token}
*Lists the status and members of a game*

#### Example:
`GET /game/6e1977af04f54c50842c8db621f5f020`

#### Response:
```json
{
    "status" : "waiting",
    "full"   : false,
    "users"  :
    [
        "Emily",
        "Tim",
        "Joe"
    ]
}
```

### POST /game/{token}/join
*Allows a user to join a game and returns basic info about that game*

#### Example:
```
POST /game/6e1977af04f54c50842c8db621f5f020/join

user=Brian
```

#### Response:
```json
{
    "status" : "joined"
}
```

#### Possible Error Responses:
```json
{
    "status"  : "ERROR",
    "message" : "Unknown Game"
}
```

```json
{
    "status"  : "ERROR",
    "message" : "Game has started"
}
```

```json
{
    "status"  : "ERROR",
    "message" : "Username already exists"
}
```

```json
{
    "status"  : "ERROR",
    "message" : "The maximum number of players has been reached"
}
```


### GET /game/{token}/start
*Starts a game. Can only be performed by the creator of a game*

#### Example:
`GET /game/6e1977af04f54c50842c8db621f5f020/start`

#### Response:
```json
{
    "status" : "started"
}
```

#### Possible Error Responses:
```json
{
    "status"  : "ERROR",
    "message" : "Unknown Game"
}
```

```json
{
    "status"  : "ERROR",
    "message" : "You are not authorised to start this game"
}
```

Debug API
---------
*These endpoints should not be used by the application itself. They are
purely convenience functions to aid with debug and development*

### GET /debug/purge/{table}
*Purges everything in the given table*

#### Possible Tables

**Game** - Contains all the games / information about which members have
joined

**User** - Contains details about users / their money / gold / miltary
etc

### GET /debug/purge
*Purges everything from all tables*

### GET /debug/me
*Returns the current list of all buildings owned by the user and their
levels, and the amount of resources they have*

**DO NOT PING THIS ENDPOINT EVERY x SECONDS**

#### Example:
`GET /debug/me`

#### Response:
```json
{
    "level"     : "Hamlet",
    "resources" :
    {
        "gold"  : 50,
        "wood"  : 200,
        "food"  : 200,
        "stone" : 200
    },
    "buildings" :
    {
        "dock" :
        {
            "level"  : 1,
            "num"    : 0,
            "people" : 0
        },
        "storage" :
        {
            "level" : 1,
            "num"   : 1
        },
        ...
    }
}
```