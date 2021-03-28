
from datetime import datetime

def room_u(room_name, password, tile_sequence):
    return f"INSERT INTO rooms (id,dateModified,password,tile_sequence) VALUES ('{room_name}', '{datetime.today()}', '{password}', '{tile_sequence}');"

def room_f(room_name):
    return f"SELECT * FROM rooms WHERE id = '{room_name}';"

def room_d(room_name):
    return f"DELETE FROM rooms WHERE id = '{room_name}';"

def room_f_tile_seq(room_name):
    return f"SELECT tile_sequence FROM rooms where id = '{room_name}'"



def player_u(id, room_name, username, is_host, sequence, icon=''):
    return f"INSERT INTO players (id,room_id,username,is_host,sequence, current_tile, icon, path) VALUES ('{id}','{room_name}','{username}',{1 if is_host else 0},{sequence}, {0}, '{icon}', {-1});"

def player_f(id):
    return f"SELECT * FROM players WHERE id = '{id}';"

def player_move(id, amount):
    return f"UPDATE players SET current_tile = current_tile + {amount} WHERE id = '{id}';"

def player_f_by_room(room_name):
    return f"SELECT * FROM players WHERE room_id = '{room_name}';"

def player_d_by_room(room_name):
    return f"DELETE FROM players WHERE room_id = '{room_name}';"

def player_d(id):
    return f"DELETE FROM players WHERE id = '{id}';"

def player_f_sequence_by_room(room_name):
    return f"SELECT max(sequence) + 1 AS next_seq FROM players WHERE room_id = '{room_name}';"

def player_f_room(id):
    return f"SELECT room_id FROM players WHERE id = '{id}';"

def player_u_seq(id, new_sequence):
    return f"UPDATE players SET sequence = {new_sequence} WHERE id = '{id}';"

def player_u_icon(id, icon):
    return f"UPDATE players SET icon = '{icon}' WHERE id = '{id}';"

def player_u_path(id, path):
    return f"UPDATE players SET path = {path} WHERE id = '{id}';"




def turn_u(room_name, last_roller, last_roll, current_turn):
    return f"INSERT INTO turns (room_id,last_roller,last_roll,current_turn) VALUES ('{room_name}','{last_roller}','{last_roll}','{current_turn}');"

def turn_iter(room_name, last_roller, last_roll):
    return f"UPDATE turns SET current_turn = current_turn + 1, last_roller = '{last_roller}', last_roll = {last_roll} WHERE room_id = '{room_name}';"

def turn_f(room_name):
    return f"SELECT * FROM turns WHERE room_id = '{room_name}';"



def tile_f():
    return f"SELECT * FROM tiles;"

def tile_f_by_id(id):
    return f"SELECT * FROM tiles WHERE id = {id};"

def tile_f_by_set(tile_set):
    return f"SELECT * FROM tiles WHERE tile_set = {tile_set}"



def board_f():
    return f"SELECT * FROM board;"

def board_u(id, pos_x, pos_y, tile_set, path, parameters = ""):
    return f"INSERT INTO board (id, pos_x, pos_y, tile_set, path, parameters) VALUES ({id}, {pos_x}, {pos_y}, {tile_set}, {path}, '{parameters}');"



def connection_f():
    return f"SELECT * FROM connection"

def connection_u(id, start, end, connection_type):
    return f"INSERT INTO connection (id, start, end, connection_type) VALUES ({id}, {start}, {end}, {connection_type});"
