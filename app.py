import os

from decouple import config as env
from flask import Flask
from flask_caching import Cache
from flask_json import FlaskJSON
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_minify import Minify
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
app = Flask(__name__)
Minify(app=app, html=True, js=True, cssless=True)

config = {"DEBUG": True, "CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 86400}
app.config.from_mapping(config)
cache = Cache(app)

json = FlaskJSON(app)

login_manager = LoginManager()
login_manager.login_message = "برای مشاهده این صفحه ابتدا باید وارد شوید."
login_manager.login_view = "auth.login"
login_manager.init_app(app)

from .auth import auth as auth_blueprint
from .main import main as main_blueprint
from .models import User


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


database_path = os.getenv("DATABASE_URL", "sqlite:///db.sqlite")
database_path = database_path.replace("postgres", "postgresql")

app.config["SECRET_KEY"] = env("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = database_path
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config.setdefault("JSON_ADD_STATUS", True)

migrate = Migrate(app, db)
db.init_app(app)
app.register_blueprint(auth_blueprint)
app.register_blueprint(main_blueprint)
