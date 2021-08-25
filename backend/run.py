# -*- coding: UTF-8 -*-
import numpy as np
import compute

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/rank', methods=['GET'])
def ranking():
    id = request.args.get('id')
    if id:
        return jsonify({'rank': compute.myrank(id)})
    else:
        return jsonify({'rank': compute.globalrank()})

@app.route('/search', methods=['GET'])
def searchID():
    qid = request.args.get('id')
    print(qid)
    print("---")
    result = compute.query(qid)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)