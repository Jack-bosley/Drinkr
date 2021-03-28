
import sqlite3
from procedures import board_u, connection_u
from utilities import Tiles, ConnectionTypes, TileParameters, PathIds
import copy

DATABASE = 'rooms.db'

class Tile:
    def __init__(self, x, y, tile_set, params = ""):
        self.id = None
        self.tile_set = tile_set
        self.x = x
        self.y = y
        self.params = params

    def __str__(self):
        return f"{self.id} {[self.tile_set]}"

class Connection:
    def __init__(self, t_start, t_end, connection_type):
        self.id = None
        self.t_start = t_start
        self.t_end = t_end
        self.connection_type = connection_type

    def __str__(self):
        return f"-({self.connection_type})->"

class Path:
    def __init__(self, tiles : [Tile], path_id):
        self.tiles = tiles
        self.connections = []
        self.path_id = path_id

        for i, t in enumerate(self.tiles):
            t.id = i

            t_start = t.id
            t_end = t_start + 1

            if t_end < len(self.tiles):
                conn = Connection(t_start, t_end, ConnectionTypes.STEP)
                conn.id = i

                self.connections.append(conn)

    def save(self):
        con = sqlite3.connect(DATABASE)
        if con is not None:
            cur = con.cursor()

            for t in self.tiles:
                query = board_u(t.id, t.x, t.y, t.tile_set, self.path_id, t.params)
                print(query)
                cur.execute(query)
                        
            for c in self.connections:
                query = connection_u(c.id, c.t_start, c.t_end, c.connection_type)
                print(query)
                cur.execute(query)

            con.commit()
            con.close()

    def __str__(self):
        string = ""
        for c in self.connections:
            string += f"{self.tiles[c.t_start]} {c} {self.tiles[c.t_end]} \n"

        return string 

class Board:
    def __init__(self, paths = [Path]):
        self.paths = paths

        i_path = 0
        i_conn = 0
        for i, p in enumerate(self.paths):
            for t in p.tiles:
                t.id = i_path
                i_path += 1
            
            for c in p.connections:
                c.id = i_conn
                i_conn += 1

    def save(self):
        for p in self.paths:
            p.save()



start_path_tiles = [Tile(0, 0, Tiles.START), Tile(1, 0, Tiles.COMMON), Tile(2, 0, Tiles.COMMON), Tile(3, 0, Tiles.COMMON), \
    Tile(4, 0, Tiles.COMMON), Tile(5, 0, Tiles.COMMON), Tile(6, 0, Tiles.COMMON), Tile(7, 0, Tiles.COMMON), Tile(8, 0, Tiles.COMMON), Tile(9, 0, Tiles.COMMON), Tile(10, 0, Tiles.COMMON)]

happy_path_tiles = [Tile(10, 2, Tiles.HAPPY), Tile(9, 2, Tiles.HAPPY), Tile(8, 2, Tiles.HAPPY), Tile(7, 2, Tiles.HAPPY), \
    Tile(6, 2, Tiles.HAPPY), Tile(5, 2, Tiles.HAPPY), Tile(4, 2, Tiles.HAPPY), Tile(3, 2, Tiles.HAPPY), Tile(2, 2, Tiles.HAPPY), Tile(1, 2, Tiles.HAPPY), \
        Tile(0, 2, Tiles.SAFE, TileParameters.DOUBLEHEIGHT), \
    Tile(1, 3, Tiles.HAPPY), Tile(2, 3, Tiles.HAPPY), Tile(3, 3, Tiles.HAPPY), Tile(4, 3, Tiles.HAPPY), Tile(5, 3, Tiles.HAPPY), \
    Tile(6, 3, Tiles.HAPPY), Tile(7, 3, Tiles.HAPPY), Tile(8, 3, Tiles.HAPPY), Tile(9, 3, Tiles.HAPPY), Tile(10, 3, Tiles.HAPPY)]

confess_path_tiles = [Tile(10, 5, Tiles.CONFESSIONAL), Tile(9, 5, Tiles.CONFESSIONAL), Tile(8, 5, Tiles.CONFESSIONAL), Tile(7, 5, Tiles.CONFESSIONAL), \
    Tile(6, 5, Tiles.CONFESSIONAL), Tile(5, 5, Tiles.CONFESSIONAL), Tile(4, 5, Tiles.CONFESSIONAL), Tile(3, 5, Tiles.CONFESSIONAL), Tile(2, 5, Tiles.CONFESSIONAL), Tile(1, 5, Tiles.CONFESSIONAL), \
        Tile(0, 5, Tiles.SAFE, TileParameters.DOUBLEHEIGHT), \
    Tile(1, 6, Tiles.CONFESSIONAL), Tile(2, 6, Tiles.CONFESSIONAL), Tile(3, 6, Tiles.CONFESSIONAL), Tile(4, 6, Tiles.CONFESSIONAL), Tile(5, 6, Tiles.CONFESSIONAL), \
    Tile(6, 6, Tiles.CONFESSIONAL), Tile(7, 6, Tiles.CONFESSIONAL), Tile(8, 6, Tiles.CONFESSIONAL), Tile(9, 6, Tiles.CONFESSIONAL), Tile(10, 6, Tiles.CONFESSIONAL)]
    
fucked_path_tiles = [Tile(10, 8, Tiles.FUCKED), Tile(9, 8, Tiles.FUCKED), Tile(8, 8, Tiles.FUCKED), Tile(7, 8, Tiles.FUCKED), \
    Tile(6, 8, Tiles.FUCKED), Tile(5, 8, Tiles.FUCKED), Tile(4, 8, Tiles.FUCKED), Tile(3, 8, Tiles.FUCKED), Tile(2, 8, Tiles.FUCKED), Tile(1, 8, Tiles.FUCKED), \
        Tile(0, 8, Tiles.SAFE, TileParameters.DOUBLEHEIGHT), \
    Tile(1, 9, Tiles.FUCKED), Tile(2, 9, Tiles.FUCKED), Tile(3, 9, Tiles.FUCKED), Tile(4, 9, Tiles.FUCKED), Tile(5, 9, Tiles.FUCKED), \
    Tile(6, 9, Tiles.FUCKED), Tile(7, 9, Tiles.FUCKED), Tile(8, 9, Tiles.FUCKED), Tile(9, 9, Tiles.FUCKED), Tile(10, 9, Tiles.FUCKED)]

end_path_tiles = [Tile(10, 11, Tiles.COMMON_END), Tile(9, 11, Tiles.COMMON_END), Tile(8, 11, Tiles.COMMON_END), Tile(7, 11, Tiles.COMMON_END), \
    Tile(6, 11, Tiles.COMMON_END), Tile(5, 11, Tiles.COMMON_END), Tile(4, 11, Tiles.COMMON_END), Tile(3, 11, Tiles.COMMON_END), Tile(2, 11, Tiles.COMMON_END), Tile(1, 11, Tiles.COMMON_END), Tile(0, 11, Tiles.END)]

start_path = Path(start_path_tiles, PathIds.INTRO)
happy_path = Path(happy_path_tiles, PathIds.HAPPY)
confess_path = Path(confess_path_tiles, PathIds.CONFESSIONAL)
fucked_path = Path(fucked_path_tiles, PathIds.FUCKED)
end_path = Path(end_path_tiles, PathIds.OUTRO)


board = Board([start_path, happy_path, confess_path, fucked_path, end_path])
board.save()