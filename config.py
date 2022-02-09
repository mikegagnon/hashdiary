import re
import os

MAX_PAGES = 100

MIN_PASSWORD_LEN = 3
MAX_PASSWORD_LEN = 64

BAD_PASSWORD_MESSAGE = """Incorrect password. Use the new_password.py script to create a new password if need be."""


SECRET_KEY = os.environ["SECRET_KEY"]
MYDIARY = os.path.expanduser(os.environ["MYDIARY"])

def sanePassword(password):
    return (
        len(password) >= MIN_PASSWORD_LEN and
        len(password) <= MAX_PASSWORD_LEN
    )

PAGEID_RE = re.compile(r"^[A-Za-z0-9\-_]+$", re.UNICODE)

def sanePageID(pageid):
    if not PAGEID_RE.match(pageid):
        return False
    elif len(pageid) < 1 or len(pageid) > 128:
        return False
    else:
        return True


def saneMarkdown(md):
    if len(md) > 1024 * 500:
        return False
    elif not md.replace("\n", "").isprintable():
        print(md)
        return False
    else:
        return True