Xanten Game
===========

Cloud Application Development - Team M

API Structure
-------------

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
    "token" : "6e1977af04f54c50842c8db621f5f020",
    "type"  : "Public",
    "name"  : "Lala"
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
            "token" : "6e1977af04f54c50842c8db621f5f020",
            "type"  : "Public",
            "name"  : "Lala"
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
    "token" : "6e1977af04f54c50842c8db621f5f020",
    "type"  : "Public",
    "name"  : "Lala"
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