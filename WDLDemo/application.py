

from flask import Flask, render_template, request, jsonify, session, redirect, json
from datetime import datetime, timedelta
import os
from routes import register_routes

#app = Flask(__name__)
app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = 'rhim_super_secret'
app.config['SESSION_TYPE'] = 'filesystem'

register_routes(app)

@app.route('/')
def index():
    return render_template('pages/login.html')


@app.route('/main')
def main():
    return render_template('pages/index.html')

@app.route('/2')
def index2():
    return render_template('pages/index2.html')


@app.route('/3')
def index3():
    return render_template('pages/index3.html')


@app.route('/catalog')
def Catalog():
    return render_template('pages/Catalog.html')



@app.route('/about')
def about():
    return render_template('pages/about.html')


@app.route('/login')
def login():
    return render_template('pages/login.html')

@app.route('/home')
def home():
    return render_template('pages/home.html')

@app.route('/home2')
def home2():
    return render_template('pages/home2.html')

@app.route('/TestDaigram')
def TestDaigram():
    return render_template('pages/TestDaigram.html')

@app.route('/functionalWF')
def functionalWF():
    return render_template('pages/functionalWF.html')


@app.route('/DemoDetails', methods=['POST'])
def DemoDetails():
    demo_id = request.form.get('demoID')
    if not demo_id:
        return jsonify({"error": "Missing demoID"}), 400

    file_path = os.path.join("DemoDetailsRepo", f"{demo_id}.json")
    print(f"Looking for file: {file_path}, demo_id: {demo_id}")
    if not os.path.exists(file_path):
        return jsonify({"error": f"No data found for Demo ID: {demo_id}"}), 404
    with open(file_path, 'r', encoding='ISO-8859-1', errors='replace') as f:
    #with open(file_path, "r", encoding="ISO-8859-1") as f:
        demo_json = json.load(f)
        print(f"demo_json: {demo_json}")
    print(f"demo_data= {json.dumps(demo_json)}")
    
    return render_template("pages/DemoDetails.html", demo_data=demo_json)
# Sample JSON Data

@app.route('/api/demos', methods=['GET'])
def get_demos():
    try:
        with open('demolist.json', 'r', encoding='utf-8-sig') as f:  
            demos = json.load(f)
        return jsonify(demos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/archDetails', methods=['GET'])
def archDetails():
    demo_id = request.args.get('demo_id')
    if not demo_id:
        return jsonify({'error': 'demo_id not provided'}), 400

    # Define primary and fallback file paths
    base_dir = os.path.join(app.root_path, 'DemoDetailsRepo', 'arch')
    primary_file = os.path.join(base_dir, f'{demo_id}_arch.json')
    fallback_file = os.path.join(base_dir, 'default_arch.json')

    try:
        filepath_to_use = primary_file if os.path.exists(primary_file) else fallback_file
        with open(filepath_to_use, 'r', encoding='utf-8-sig') as f:
            demos = json.load(f)
        return jsonify(demos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=8000)

