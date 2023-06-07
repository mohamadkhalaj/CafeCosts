from flask_login import UserMixin

from .app import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    ingredients = db.relationship("Ingredient", backref="user", lazy=True)
    items = db.relationship("Item", backref="user", lazy=True)


class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    full_price = db.Column(db.Float)
    oneK_price = db.Column(db.Float)
    additionalCost = db.Column(db.Float)
    weight = db.Column(db.Float)
    multiplier = db.Column(db.Float)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    items = db.relationship("Item", backref="ingredient", lazy=True)


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    price = db.Column(db.Float)
    weight = db.Column(db.Float)
    weight_used = db.Column(db.Float)
    ingredient_id = db.Column(db.Integer, db.ForeignKey("ingredient.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
