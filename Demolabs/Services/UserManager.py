from flask import jsonify
import os, sys

# Setup path to access DAL
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from DAL.db_utils import DBUtils

# Use global db instance with the right DB
db = DBUtils("UserManager")

def identify_internal_user(username):
    print(f"[DEBUG]::identify_internal_user:: username: {username}")
    if not username:
        return jsonify({"message": "Username is required"}), 400

    user = db.execute_query("SELECT name, role FROM regular_employees WHERE email = ?", (username,))
    print(f"[DEBUG]::identify_internal_user::RETURNING:: user: {user}")
    return user


def identify_external_user(username):
    print(f"[DEBUG]::identify_external_user:: username: {username}")
    if not username:
        return jsonify({"message": "Username is required"}), 400

    user = db.execute_query("SELECT name, supervisor_email FROM contractual_employees WHERE mobile = ?", (username,))
    print(f"[DEBUG]::identify_external_user::RETURNING:: user: {user}")
    return user


def validate_passwordBck(email, password):
    print(f"[DEBUG]::validate_password:: email: {email}")
    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = db.execute_query("SELECT name, role FROM regular_employees WHERE email = ? AND password = ?", (email, password))
    
    print(f"[DEBUG]::validate_password::RETURNING:: user: {user}")
    return user
