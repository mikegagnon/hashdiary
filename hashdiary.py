import glob
import os
import sys
from flask import Flask
from flask import session, request, render_template, abort, current_app, url_for, redirect
from flask_wtf import FlaskForm
from flask_wtf.csrf import CSRFProtect
from wtforms import StringField, PasswordField
from flask_bcrypt import Bcrypt

import config

# PAGEIDS = None

# def updatePageIds():
#     nonlocal PAGEIDS
#     PAGEIDS = list(map(lambda x: os.path.splitext(os.path.basename(x))[0], glob.glob(os.path.join(config.MYDIARY, "*.hd"))))
#     return 

def getPageIds():
    return list(map(lambda x: os.path.splitext(os.path.basename(x))[0], glob.glob(os.path.join(config.MYDIARY, "*.hd"))))

def get_saved_pw_hash():
    with open(os.path.expanduser("~/hashdiary-pw.txt"), "r") as f:
        return f.read()

HASHDIARY_PW_HASH = get_saved_pw_hash()

app = Flask(__name__)
app.config["SECRET_KEY"] = config.SECRET_KEY
bcrypt = Bcrypt(app)

@app.route("/")
def root():
    if "loggedin" not in session:
        return redirect(url_for("login"))
    else:
        return redirect(url_for("page", pageid="root"))

@app.route("/page/<pageid>")
def page(pageid):
    pageids = getPageIds()

    if not config.sanePageID(pageid):
        abort(404)

    if "loggedin" not in session:
        return redirect(url_for("login")) 

    try:
        print(os.path.join(config.MYDIARY, pageid + ".hd"))
        with open(os.path.join(config.MYDIARY, pageid + ".hd"), "r") as f:
            contents = f.read()
    except:
        contents = "Missing"

    return render_template("page.html", contents=contents, pageids=pageids)


class LoginForm(FlaskForm):
    password = PasswordField("Password")

class EmptyForm(FlaskForm):
    pass

def pop_session():
    session.pop("loggedin", None)

@app.route("/logout", methods=["GET", "POST"])
def logout():
    form = EmptyForm(request.form)

    if "loggedin" not in session:
        return render_template("message.html", form=form, message="You are already logged out.")

    if request.method == "GET":
        return render_template("logout.html", form=form)

    if not form.validate_on_submit():
        abort(403)

    pop_session()
    return render_template("message.html", form=form, message="You are now logged out.")


@app.route("/login", methods=["GET", "POST"])
def login():

    form = LoginForm(request.form)

    if "loggedin" in session:
        return render_template("message.html", form=form,  message="You are already logged in.")

    if request.method == "GET":
        return render_template("login.html", form=form, message=None)

    if not form.validate_on_submit():
        abort(403)

    submitted_password = form.password.data

    if not config.sanePassword(submitted_password):
        return render_template("login.html", form=form, message=config.BAD_PASSWORD_MESSAGE)

    if bcrypt.check_password_hash(HASHDIARY_PW_HASH, submitted_password):
        #print(HASHDIARY_PW_HASH)
        session["loggedin"] = True

        return redirect(url_for("root"))
    else:
        return render_template("login.html", form=form, message=config.BAD_PASSWORD_MESSAGE)

    return render_template("login.html")
