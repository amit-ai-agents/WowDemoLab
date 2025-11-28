from flask import Blueprint, redirect, render_template, session, jsonify, request
import json

SysAdmin_bp = Blueprint('SysAdmin', __name__, url_prefix='/SysAdmin')


@SysAdmin_bp.route('/')
def SysDashboard():
    return render_template("SysAdmin/dashboard.html")


@SysAdmin_bp.route('/ConcurAPIDetails')
def ConcurAPIDetails():
    return render_template("SysAdmin/ConcurAPIDetails.html")


@SysAdmin_bp.route('/UserManager')
def UserManager():
    return render_template("SysAdmin/UserManager.html")


@SysAdmin_bp.route('/AdapterConfiguration')
def AdapterConfiguration():
    return render_template("SysAdmin/AdapterConfiguration.html")


@SysAdmin_bp.route('/TravelFieldMapper')
def TravelFieldMapper():
    return render_template("SysAdmin/TravelFieldMapper.html")


@SysAdmin_bp.route('/ThirdPartyConnector')
def ThirdPartyConnector():
    return render_template("SysAdmin/ThirdPartyConnector.html")

@SysAdmin_bp.route('/UserAccessManagement')
def UserAccessManagement():
    return render_template("SysAdmin/UserAccessManagement.html")


@SysAdmin_bp.route('/DataManagementConsole')
def DataManagementConsole():
    return render_template("SysAdmin/DataManagementConsole.html")


@SysAdmin_bp.route('/NotificationCenter')
def NotificationCenter():
    return render_template("SysAdmin/NotificationCenter.html")


@SysAdmin_bp.route('/LogsAndDiagnostics')
def LogsAndDiagnostics():
    return render_template("SysAdmin/LogsAndDiagnostics.html")

json_path = 'config/ExtAPI/Concur/api_details.json'

@SysAdmin_bp.route('/api/concur-apis', methods=['GET'])
def get_concur_apis():
    with open(json_path) as f:
        return jsonify(json.load(f))

@SysAdmin_bp.route('/api/concur-apis/<category>/<int:index>', methods=['PUT'])
def update_api(category, index):
    data = request.json
    print(f"SysAdmin::Update_api_concur::data = {data}")
    with open(json_path, 'r') as f:
        apis = json.load(f)
        print(f"SysAdmin::Update_api_concur::json_path found at = {json_path}")
    apis["ConcurAPIs"][category]['apis'][index] = data
    print(f"SysAdmin::Update_api_concur::apis[category] = {apis['ConcurAPIs'][category]}")
    with open(json_path, 'w') as f:
        json.dump(apis, f, indent=2)
    return jsonify({'status': 'updated'})

