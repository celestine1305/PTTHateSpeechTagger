# -*- coding: UTF-8 -*-
import numpy as np
import compute

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return 'homepage'

"""
@app.route('/tutorial')
"""

@app.route('/rank', methods=['POST'])
def ranking():
    id = request.get_json()['id']
    if id:
        return jsonify({'rank': compute.myrank(id)})
    else:
        return jsonify({'rank': compute.globalrank()})

@app.route('/search', methods=['POST'])
def searchID():
    qid = request.get_json()['id']
    result = compute.query(qid)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)