import os
import sqlite3

class DBUtils:
    def __init__(self, service_name: str):
        self.service_name = service_name
        print(f"[DEBUG]::DBUtils::__init__:: service_name: {service_name}")
        self.db_path = self._resolve_db_path(service_name)
        print(f"[DEBUG]::DBUtils::__init__:: Database path resolved: {self.db_path}")
        self.connection = sqlite3.connect(self.db_path, check_same_thread=False)
        self.connection.row_factory = sqlite3.Row
        self.cursor = self.connection.cursor()

    def _resolve_db_path(self, service_name):
        env_base_path = os.getenv("DATA_REPO_BASE")
        if env_base_path:
            base_dir = env_base_path
            print(f"[DEBUG]::DBUtils::_resolve_db_path:: Using Azure ENV path: {base_dir}")
        else:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../DataRepo/Database'))
            print(f"[DEBUG]::DBUtils::_resolve_db_path:: Using Local path: {base_dir}")

        db_file = f"{service_name}.db"
        full_path = os.path.join(base_dir, db_file)
        print(f"[DEBUG]::DBUtils::_resolve_db_path:: full_path: {full_path}")

        if not os.path.exists(full_path):
            raise FileNotFoundError(f"Database not found for service '{service_name}' at {full_path}")

        return full_path

    def get_connection(self):
        return sqlite3.connect(self.db_path)

    def execute_query(self, query, params=()):
        try:
            print(f"[DEBUG]::DBUtils::execute_query:: query: {query}")
            self.cursor.execute(query, params)
            results = self.cursor.fetchall()
            print(f"[DEBUG]::DBUtils::execute_query:: results: {results}")
            return results
        except Exception as e:
            print(f"[ERROR] db_utils:: execute_query Exception: {e}")
            return []

    def execute_insert_returning_id(self, query, params=()):
        print(f"[DEBUG]::DBUtils::execute_insert_returning_id:: query: {query}")
        self.cursor.execute(query, params)
        self.connection.commit()
        inserted_id = self.cursor.lastrowid
        print(f"[DEBUG]::DBUtils::execute_insert_returning_id:: inserted_id: {inserted_id}")
        return inserted_id

