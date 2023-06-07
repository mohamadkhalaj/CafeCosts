from flask import Blueprint, redirect, render_template, request, url_for
from flask_json import json_response
from flask_login import current_user, login_required
from flask_minify import decorators as minify_decorators

from .app import db
from .models import Ingredient, Item

main = Blueprint("main", __name__)


@main.route("/")
@main.route("/<id>")
@minify_decorators.minify(html=True, js=True, cssless=True)
def index(id=None):
    if current_user.is_authenticated and id:
        try:
            ingredients = Ingredient.query.filter_by(user_id=current_user.id, id=id).first()
            return render_template("index.html", data=serializer(ingredients))
        except:
            return redirect(url_for("main.index"))
    elif id:
        return redirect(url_for("main.index"))
    else:
        return render_template("index.html")


@main.route("/dashboard/", methods=["POST", "GET"])
@login_required
@minify_decorators.minify(html=True, js=True, cssless=True)
def dashboard():
    if request.method == "POST":
        id = request.form["id"]

        Item.query.filter_by(ingredient_id=id, user_id=current_user.id).delete()
        Ingredient.query.filter_by(id=id, user_id=current_user.id).delete()
        db.session.commit()
        return json_response()

    ingredients = Ingredient.query.filter_by(user_id=current_user.id)
    return render_template("dashboard.html", data=ingredients)


def serializer(data):
    main = {}
    itemsArr = []

    main["title"] = data.title
    main["full_price"] = data.full_price
    main["oneK_price"] = data.oneK_price
    main["additionalCost"] = data.additionalCost
    main["weight"] = data.weight
    main["multiplier"] = data.multiplier

    for item in data.items:
        temp = {}
        temp["name"] = item.name
        temp["price"] = item.price
        temp["weight"] = item.weight
        temp["weight_used"] = item.weight_used

        itemsArr.append(temp)

    main["items"] = itemsArr
    return main
