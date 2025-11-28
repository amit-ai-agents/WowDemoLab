
from flask import Blueprint, redirect, render_template, session, jsonify

manager_bp = Blueprint('manager', __name__, url_prefix='/manager')

@manager_bp.route('/')
def workspace_page():

    print("[DEBUG] Rendering Manager/dashboard.html")
    return render_template("Manager/dashboard.html")


@manager_bp.route('/MyProfile')
def MyProfile():

    print("[DEBUG] Rendering Manager/list_claims.html")
    return render_template("Manager/list_claims.html")

@manager_bp.route('/ListClaim')
def ListClaim():

    print("[DEBUG] Rendering GenEmp/list_claims.html")
    return render_template("GenEmp/list_claims.html")

@manager_bp.route('/ListClaimsS')
def ListClaimsS():

    print("[DEBUG] Rendering Manager/ListClaimsS.html")
    return render_template("Manager/ListClaimsS.html")

@manager_bp.route('/supervisor_approvals')
def supervisor_approvals():

    print("[DEBUG] Rendering Manager/supervisor_approvals.html")
    return render_template("Manager/supervisor_approvals.html")


@manager_bp.route('/TeamManagement')
def TeamManagement():

    print("[DEBUG] Rendering Manager/dashboard.html")
    return render_template("Manager/TeamManagement.html")



@manager_bp.route('/Settings')
def Settings():

    print("[DEBUG] Rendering Manager/dashboard.html")
    return render_template("Manager/Settings.html")



@manager_bp.route('/Notifications')
def Notifications():

    print("[DEBUG] Rendering Manager/dashboard.html")
    return render_template("Manager/Notifications.html")





