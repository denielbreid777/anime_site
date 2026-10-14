
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone


pass_context = CryptContext(
    schemes=['bcrypt'],
    deprecated="auto"
)

def get_password_hash(password: str) -> str:
    return pass_context.hash(password)

def verify_password(password: str, hash_password:str) -> bool:
    return pass_context.verify(password, hash_password)




def create_token(id):
    lifetime = datetime.now(timezone.utc) + timedelta(minutes=30)
    payload = {"sub": str(id), "exp": lifetime}
    secret_key = "nafjksbe23b4jkskdjfbgl2j345blkjsdbfgljkb23ljk4b52lbsdfd"

    token = jwt.encode(payload, secret_key)

    return token

def decode_token(token):
    secret_key = "nafjksbe23b4jkskdjfbgl2j345blkjsdbfgljkb23ljk4b52lbsdfd"
    try:
        payload = jwt.decode(token, secret_key)
    except:
        return None

    return int(payload["sub"])