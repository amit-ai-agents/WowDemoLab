from flask import Blueprint, request, session, jsonify, send_from_directory
from datetime import datetime, timedelta
import random, sys, os


ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from Services.UserManager import identify_internal_user, identify_external_user, validate_passwordBck

from Services.EmailService import send_otp_email, send_approval_request_email, send_decision_email

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/identify_user', methods=['POST'])
def identify_user():
    username = request.form.get('username')
    print(f"[DEBUG]::[FRONTEnd-Routes::auth_route]::identify_user:: username: {username}")
    if not username:
        return jsonify({"error": "Username is required"}), 400

    if "@" in username:
        # Internal user
        try:
            user = identify_internal_user(username)
            print(f"[DEBUG]::[FRONTEnd-Routes::auth_route]::Response from Service-->UserManager : {user}")
            if user:
                user_data = dict(user[0])
                print(f"[DEBUG]::[FRONTEnd-Routes::auth_route]::RESPONSE_RECIEVED from BACKEND:: user_data: {user_data}")
                session['user'] = user_data['name']
                session['roles'] = user_data['role']
                session['email'] = user_data['name']
                session['expected_type'] = 'internal'
                return jsonify(type='internal'), 200
            else:
                return jsonify({"message": "User not found"}), 404

        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        # External user (mobile-based)
        try:
            user = identify_external_user(username)
            if user:
                user_data = dict(user[0])
                print(f"[DEBUG]::[FRONTEnd-Routes::auth_route]::RESPONSE_RECIEVED from BACKEND:: user_data: {user_data}")
                otp = "777777" #str(random.randint(100000, 999999))
                expiry = datetime.now().timestamp() + (5 * 60)  # 5 minutes ahead

                session['user'] = user_data['name']
                session['mobile'] = user_data['name']
                session['expected_type'] = 'external'
                session['supervisor_email'] = user_data['supervisor_email']
                session['otp'] = otp
                session['expiry'] = expiry

                # You could send the OTP via SMS here
                print(f"DEBUG OTP for {username}: {otp}")

                return jsonify(type='external'), 200
            return jsonify(type=None, message="User not found."), 401
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500


@auth_bp.route('/validate_password', methods=['POST'])
def validate_password():
    email = request.form.get('username')
    password = request.form.get('password')

    print(f"[DEBUG]::[FRONTEnd-Routes::auth_route]::validate_password :: email: {email} and password is {password} ")
    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required."}), 400

    try:
        print(f"[DEBUG]::[FRONTEnd-Routes::auth_route]::CALLING Backend Service with UserManager.validate_password:: email: {email} and password is {password} ")
        user = validate_passwordBck(email, password)
        if user:
            user_data = dict(user[0])
            print(f"[DEBUG]::[FRONTEnd-Routes::auth_route]::RESPONSE_RECIEVED from BACKEND:: user_data: {user_data}")

            session['role_type'] = 'Internal_Employee'
            session['name'] = user_data['name']
            session['role'] = user_data['role']
            session['expires_at'] = (datetime.utcnow() + timedelta(minutes=30)).timestamp()

            role_redirect_map = {
                'general_employee': "/main",
                'help_desk': "/HelpDesk",
                'it_support': "/SysAdmin",
                'manager': "/main",
            }

            redirect_url = role_redirect_map.get(user_data['role'], "/pm")

            return jsonify(success=True, redirect=redirect_url)
        return jsonify(success=False, message="Invalid credentials."), 401
    except Exception as e:
        return jsonify(success=False, message=str(e)), 500


@auth_bp.route('/validate_otp', methods=['POST'])
def validate_otp():
    otp = request.form.get('otp')
    shared_otp = session.get('otp')
    expiry_ts = session.get('expiry')

    if not shared_otp or not expiry_ts:
        return jsonify(success=False, message="Session expired or not initialized."), 400

    try:
        expiry_dt = float(expiry_ts)
    except ValueError:
        return jsonify(success=False, message="Invalid session expiry."), 500

    if otp == shared_otp and expiry_dt > datetime.now().timestamp():
        session['role_type'] = 'External_Employee'
        session['role'] = 'contractual'
        session['expires_at'] = (datetime.utcnow() + timedelta(minutes=30)).timestamp()
        return jsonify(success=True, redirect="/Ext/")
    else:
        return jsonify(success=False, message="Invalid or expired OTP.")


@auth_bp.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200


@auth_bp.route('/me', methods=['GET'])
def me():
    user_id = session.get('user_id')
    user_details = session.get('user_details')
    ws_details = session.get('ws_details')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    #user = db.get_user_by_id(user_id)
    return jsonify(
        user = user_details,
        user_ws = ws_details
        ), 200
