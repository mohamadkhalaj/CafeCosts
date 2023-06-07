from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_json import json_response
from flask_login import current_user, login_required, login_user, logout_user
from flask_minify import decorators as minify_decorators
from password_strength import PasswordPolicy
from werkzeug.security import check_password_hash, generate_password_hash

from .app import db
from .models import Ingredient, Item, User

policy = PasswordPolicy.from_names(
    length=6,
    numbers=2,
)

auth = Blueprint("auth", __name__)


@auth.route("/login/")
@minify_decorators.minify(html=True, js=True, cssless=True)
def login():
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))
    return render_template("login.html")


@auth.route("/login/", methods=["POST"])
def login_post():
    username = request.form.get("username")
    password = request.form.get("password")

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password, password):
        flash("لطفا اطلاعات وارد شده را بررسی کنید.")
        return redirect(url_for("auth.login"))

    login_user(user)
    return redirect(url_for("main.dashboard"))


@auth.route("/signup/")
@minify_decorators.minify(html=True, js=True, cssless=True)
def signup():
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))
    return render_template("signup.html")


@auth.route("/signup/", methods=["POST"])
def signup_post():
    username = request.form.get("username")
    password1 = request.form.get("password1")
    password2 = request.form.get("password2")

    user = User.query.filter_by(username=username).first()

    if user:
        flash("این نام کاربری وجود دارد.")
        return redirect(url_for("auth.signup"))

    if password1 != password2:
        flash("پسورد ها یکسان نیستند!")
        return redirect(url_for("auth.signup"))

    if len(policy.test(password1)) != 0:
        flash("رمز عبور باید حداقل 6 کاراکتر و شامل حداقل 2 عدد باشد.")
        return redirect(url_for("auth.signup"))

    password = password1
    new_user = User(username=username, password=generate_password_hash(password, method="sha256"))

    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for("auth.login"))


@auth.route("/logout/")
@login_required
def logout():
    logout_user()
    return redirect(url_for("main.index"))


@auth.route("/api/saveData/", methods=["POST"])
@login_required
def saveData():
    data = request.get_json()

    title = data["title"]
    full_price = data["full_price"]
    oneK_price = data["oneK_price"]
    additionalCost = data["additionalCost"]
    weight = data["weight"]
    multiplier = data["multiplier"]
    user_id = current_user.id

    ingredients = Ingredient(
        title=title,
        full_price=full_price,
        oneK_price=oneK_price,
        additionalCost=additionalCost,
        weight=weight,
        multiplier=multiplier,
        user_id=user_id,
    )

    db.session.add(ingredients)
    db.session.commit()

    items = data["items"]
    for item in items:
        name = item["name"]
        price = item["price"]
        weight = item["weight"]
        weight_used = item["weight_used"]
        ingredient_id = ingredients.id

        itemObj = Item(
            name=name,
            price=price,
            weight=weight,
            weight_used=weight_used,
            ingredient_id=ingredient_id,
            user_id=user_id,
        )

        db.session.add(itemObj)
        db.session.commit()

    return json_response()
