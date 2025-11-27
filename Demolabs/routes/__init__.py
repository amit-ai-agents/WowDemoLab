from .auth_routes import auth_bp
from .SysAdmin_routes import SysAdmin_bp
from .Manager_routes import manager_bp



def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(SysAdmin_bp)
    #app.register_blueprint(copilot_bp)
    app.register_blueprint(manager_bp)

