**WDL Demo  – Unified Architecture **

This repository contains  main module :

*    WDL Demo
     → Backend / API Layer
     → Frontend (Flask-based UI)

Both modules follow a  modular and scalable architecture  for enterprise-grade applications.

📂 Project Structure 

1️⃣ WDLDemo – Backend (API Layer) ,Frontend


WDLDemo/
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
|    ├── pages/               # HTML screens
|    └── partials/            # HTML partials (header, footer)
├── main.py         # Flask entry point for the frontend, running at port = 2006
└── config.py      # Configuration for the frontend (e.g., API URLs)

   
🔗 Integration

*   Frontend communicates with  Backend  via REST APIs.
*   API URLs configured in `WDLDemo/Web/config.py`.

🚀 Deployment 

 #  Azure WebApp Deployment Example 

```bash
az webapp deploy \
  --resource-group WoW-Demo-Lab-RG \
  --name WowDemoLab \
  --src-path myapp.zip \
  --type zip
```

 *

   ✅ Installation & Setup 

 #  Backend 

```bash
cd WDLDemo
pip install -r requirements.txt
python application.py
```

 #  Frontend 

```bash
cd WDLDemo
pip install -r requirements.txt
python application.py
```
