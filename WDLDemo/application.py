
from flask import Flask, render_template, request, jsonify, session, redirect, json, url_for
from datetime import datetime, timedelta
import os
from routes import register_routes

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = 'rhim_super_secret'  # Required for session encryption

register_routes(app)

# ✅ NEW: Endpoints exempt from login checks
AUTH_EXEMPT = {
    "login", "static",
    "auth.identify_user", "auth.validate_password", "auth.validate_otp", "auth.logout"
}

# ✅ NEW: Global session enforcement
@app.before_request
def require_login():    
    endpoint = request.endpoint
    print(f"[DEBUG] Session: {session}")
    print(f"[DEBUG] Endpoint: {endpoint}")
    print(f"[DEBUG]::require_login:: endpoint: {endpoint}")
    if not endpoint or endpoint in AUTH_EXEMPT:
        return

    # Check if user is logged in
    if 'role_type' not in session:
        if request.path.startswith("/api") or request.is_json:
            return jsonify({"error": "Unauthorized"}), 401
        return redirect(url_for('login'))

    # Check session expiry
    if datetime.utcnow().timestamp() > session.get('expires_at', 0):
        session.clear()
        if request.path.startswith("/api") or request.is_json:
            return jsonify({"error": "Session expired"}), 401
        return redirect(url_for('login'))

@app.route('/')
def index():
    return render_template('pages/login.html')

@app.route('/login', methods=['GET'])
def login():
    return render_template('pages/login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/home')
def home():
    return render_template('pages/home.html')

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
    if not os.path.exists(file_path):
        return jsonify({"error": f"No data found for Demo ID: {demo_id}"}), 404
    with open(file_path, 'r', encoding='ISO-8859-1', errors='replace') as f:
        demo_json = json.load(f)
    return render_template("pages/DemoDetails.html", demo_data=demo_json)

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
    app.run(debug=True, host='0.0.0.0', port=8000)
