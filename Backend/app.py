from flask import Flask, jsonify, request
import time
import hashlib
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

def id_generate():
    return hashlib.md5(str(time.time()).encode()).hexdigest()[0:6]

class question:

    def __init__(self, owner, content):
        self.id = id_generate()
        self.owner = owner
        self.content = content
        self.approve = False
        self.answer = False
        self.time = int(time.time())

class room:
    list = {}

    def __init__(self, name, owner, password):
        self.id = id_generate()
        self.name = name
        self.owner = owner
        self.password = password
        self.question = []

        room.list[self.id] = self

    def question_ask(self, owner, content):
        question_create = question(owner, content)
        self.question.append(question_create)
        return question_create

@app.route('/room/create', methods=['POST'])
def room_create():
    name = request.form['name']
    owner = request.form['owner']
    password = request.form['password']

    room_create = room(name, owner, password)

    return jsonify(
        success=True,
        id=room_create.id
    )

@app.route('/room/<id>/screen', methods=['POST'])
def room_screen(id):
    if not id in room.list:
        return jsonify(
            reason='ROOM_EXIST',
            success=False
        )

    room_get = room.list[id]

    response = {
        'id': room_get.id,
        'name': room_get.name,
        'owner': room_get.owner,
    }

    response_question = []

    for q in room_get.question:
        if not q.approve:
            continue
        qd = {
            'id': q.id,
            'content': q.content,
            'answer': q.answer,
            'time': q.time
        }
        if q.owner:
            qd['owner'] = q.owner
        response_question.append(qd)

    response['question'] = response_question
    response['success'] = True

    return jsonify(response)


@app.route('/room/<id>/question/ask', methods=['POST'])
def room_question_ask(id):
    owner = request.form['owner'] if 'owner' in request.form else None
    content = request.form['content']

    if not id in room.list:
        return jsonify(
            reason='ROOM_EXIST',
            success=False
        )

    question_ask = room.list[id].question_ask(owner, content)

    return jsonify(
        id=question_ask.id,
        success=True
    )

@app.route('/room/<rid>/question/<qid>/mod', methods=['POST', 'DELETE'])
def room_question_mod(rid, qid):
    password = request.form['password']

    if not rid in room.list:
        return jsonify(
            reason='ROOM_EXIST',
            success=False
        )

    room_get = room.list[rid]

    if not room_get.password == password:
        return jsonify(
            reason='PASSWORD_WRONG',
            success=False
        )

    question_found = False
    question_method = True if request.method == 'POST' else False if request.method == 'DELETE' else False

    for q in room_get.question:
        if not q.id == qid:
            continue
        question_found = True
        if question_method:
            if 'answer' in request.form:
                answer = bool(request.form['answer'])
                if answer:
                    q.answer = True
            q.approve = True
        else:
            room_get.question.remove(q)

    if not question_found:
        return jsonify(
            reason='QUESTION_EXIST',
            success=False
        )

    return jsonify(
        success=True
    )

if __name__ == '__main__':
    app.run()
