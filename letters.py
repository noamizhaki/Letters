from bottle import route, run, template, static_file, get, post, request
import json
import pickle
from os import listdir, path
import os.path


file_name = "all_scores.text"

words = ["SHAKIRA", "JOHNLENNON", "SABLIMINAL","JOHNNYCASH", "PINKFLOYD", "LEDZEPPELIN", "EYALGOLAN"]

@get("/")
def index():
    return template("letters.html")

@get("/words")
def get_words():
    return json.dumps(words)

@post("/game_over")
def get_new_score():
    score = request.params["score"]
    score = int(score)
    if not os.path.exists(file_name):
        records = []
        f_all = open(file_name, 'w')
        records.append(score)
        pickle.dump(records, f_all)
        f_all.close()
    else:
        records = load()
        records.append(score)
        records.sort()
        records.reverse()
        if len(records) > 5:
            records.pop()
        f_all = open(file_name, 'w')
        pickle.dump(records, f_all)
        f_all.close()
    return json.dumps(records)

@get('/js/<filename:re:.*\.js>')
def javascripts(filename):
    return static_file(filename, root='js')


@get('/css/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='css')


@get('/js/<filename:re:.*\.css>')
def stylesheets(filename):
    return static_file(filename, root='js')


@get('/images/<filename:re:.*\.(jpg|png|gif|ico)>')
def images(filename):
    return static_file(filename, root='images')

def load():
    if os.path.exists(file_name):
        f_all = open(file_name, 'r')
        records = pickle.load(f_all)
        f_all.close()
        return records

run(host='localhost', port=7000)