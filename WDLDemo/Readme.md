az webapp deploy --resource-group WoW-Demo-Lab-RG --name WowDemoLab --src-path myapp12.zip --type zip
	
DemoFactory/       			# Project root directory
	└── Web/          			# Flask Frontend
		├── routes/        		# All routes 
		│   ├── __init__.py     # register all routes for all:: def register_routes(app):
		│   ├── auth_route.py   # indisvidual routes
		│   └── ....py			# ....
		├── static/        # CSS, JS, Images
		│   ├── css/       # Bootstrap and custom styles
		│   ├── js/        # Custom JavaScript
		│   └── images/    # Icons, logos, etc.
		├── templates/     # Jinja2 templates
		│   ├── layouts/   # Base templates (header, footer, navigation)
		│   └── pages/     # Specific screens (Dashboard, Maintenance, Fault Management)
		├── main.py         # Flask entry point for the frontend, running at port = 2006
		└── config.py      # Configuration for the frontend (e.g., API URLs)
	


DemoFactory/
│
├── application.py           # Main backend entry point (Flask app)
├── requirements.txt         # Python dependencies
├── Readme.md                # Backend-specific documentation
│
├── DAL/                     # Data Access Layer
│   └── ...                  # Database interaction logic
│
├── DataRepo/                # Data files (CSV, JSON, etc.)
│   └── ...
│
├── routes/                  # Flask route handlers
│   ├── __init__.py          # Registers all routes (def register_routes(app))
│   ├── auth_routes.py       # Authentication endpoints (login, signup)
│   ├── Manager_routes.py    # Manager dashboard routes
│   ├── SysAdmin_routes.py   # System admin dashboard routes
│
├── Services/                # Service logic (email, user management)
│   └── ...
│
├── static/                  # CSS, JS, images
│   ├── css/
│   ├── js/
│   └── images/
│
└── templates/               # Jinja2 templates
    ├── pages/               # HTML screens
    └── partials/            # HTML partials (header, footer)