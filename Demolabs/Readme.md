az webapp deploy --resource-group WoW-Demo-Lab-RG --name WowDemoLab --src-path myapp.zip --type zip
	
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
	
