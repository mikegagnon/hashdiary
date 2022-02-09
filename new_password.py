import os
from flask_bcrypt import Bcrypt
import getpass

bcrypt = Bcrypt(None)

password = getpass.getpass()
#print(password)
pwhash = bcrypt.generate_password_hash(password)

with open(os.path.expanduser("~/hashdiary-pw.txt"), "wb") as f:
    f.write(pwhash)

print("Wrote hash of password to ~/hashdiary-pw.txt")

