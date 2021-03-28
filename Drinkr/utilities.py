
import random, string

MAX_ATTEMPTS = 10

class Tiles:
    START = 0
    END = 1
    JAIL = 2
    SAFE = 3

    COMMON = 10
    HAPPY = 11
    CONFESSIONAL = 12
    FUCKED = 13
    COMMON_END = 14

class ConnectionTypes:
    STEP = 0
    JUMP = 1

class TileParameters:
    DOUBLEHEIGHT = "dh,"

class PathIds:
    INTRO = 0
    OUTRO = 1

    HAPPY = 11
    CONFESSIONAL = 12
    FUCKED = 13

def random_room_key():
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(6))


def isNoneOrEmptyOrSpace(string):
    return string is None or string.isspace() or string == ""

def random_roll():
    return random.choice([1, 2, 3, 4, 5, 6])

def select_random_tile(tiles, tile_set):
    tiles_filtered = [t for t in tiles if t['tile_set'] == tile_set]

    if len(tiles_filtered) == 0:
        return False
    elif len(tiles_filtered) == 1:
        return tiles_filtered[0]
    else:
        return random.choice(tiles_filtered)

def generate_tile_sequence(tiles, board):
    for t in tiles:
        print(t)
    for b in board:
        print(b)

    tile_sequence = ""
    for b in board:
        random_tile = select_random_tile(tiles, b['tile_set'])
        tile_sequence += f"{b['id']}:{random_tile['id']}|"

    return tile_sequence