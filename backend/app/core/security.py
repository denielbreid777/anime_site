from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from backend.app.core.config import settings


pass_context = CryptContext(
    schemes=['bcrypt'],
    deprecated="auto"
)

def get_password_hash(password: str) -> str:
    return pass_context.hash(password)

def verify_password(password: str, hash_password:str) -> bool:
    return pass_context.verify(password, hash_password)




def create_token(id):
    lifetime = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(id), "exp": lifetime}

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return token

def decode_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return int(payload["sub"])
    except:
        return None