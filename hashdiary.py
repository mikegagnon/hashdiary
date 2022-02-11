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
    return list(map(lambda x: os.path.splitext(os.path.splitext(os.path.basename(x))[0])[0], glob.glob(os.path.join(config.MYDIARY, "*.hd.md"))))

def get_saved_pw_hash():
    with open(os.path.expanduser("~/hashdiary-pw.txt"), "r") as f:
        return f.read()

HASHDIARY_PW_HASH = get_saved_pw_hash()

app = Flask(__name__)
app.config["SECRET_KEY"] = config.SECRET_KEY
bcrypt = Bcrypt(app)
csrf = CSRFProtect(app)

@app.route("/")
def root():
    if "loggedin" not in session:
        return redirect(url_for("login"))
    else:
        return redirect(url_for("page", pageid="root"))

@app.route("/page/<pageid>", methods=["GET", "POST"])
def page(pageid):
    form = EmptyForm()
    if not config.sanePageID(pageid):
        abort(404)

    if "loggedin" not in session:
        return redirect(url_for("login")) 

    if request.method == "GET":

        pageids = getPageIds()

        try:
            print(os.path.join(config.MYDIARY, pageid + ".hd.md"))
            with open(os.path.join(config.MYDIARY, pageid + ".hd.md"), "r") as f:
                contents = f.read()
        except:
            contents = ""

        return render_template("page.html", contents=contents, pageids=pageids, pageid=pageid, form=form)
    elif request.method == "POST":
        if "md" not in request.json:
            print("No md")
            abort(400)
        md = request.json["md"]

        if not config.saneMarkdown(md):
            print("not sane markdown")
            print(md.isprintable())
            abort(400)

        pageids = getPageIds()
        if pageid not in pageids and len(pageids) >= config.MAX_PAGES:
            print("Too many pages")
            abort(403)

        print(os.path.join(config.MYDIARY, pageid + ".hd.md"))
        with open(os.path.join(config.MYDIARY, pageid + ".hd.md"), "w") as f:
            f.write(md)

        print("Saved", pageid)
        print("request", )
        return "good"
    else:
        abort(400)


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
