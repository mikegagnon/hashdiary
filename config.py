import os

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