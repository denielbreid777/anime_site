from pydantic import BaseModel, Field, ConfigDict, field_validator, SecretStr
import re



class UserBase(BaseModel):
    username: str = Field(description="User name", examples=["Artur"])
    email: str = Field(description="User email", examples=["artur@gmail.com"])
    model_config = ConfigDict(from_attributes=True)




class UserRespons(UserBase):
    is_admin: bool = Field(description="Is user admin", examples=[False])





class UserRegistr(UserBase):
    password: SecretStr = Field(description="User password. Password has to be not shorter then 8 symbols. 1 capital letter required. Minimun 1 special symbol", 
                          examples=["12Ukrain34!"],
                          min_length=8,
                          max_length=30
                        )

    @field_validator('password')
    @classmethod
    def validate_password(cls, value: SecretStr) -> SecretStr:
        password = value.get_secret_value()

        if not re.search(r"[A-Z]", password):
            raise ValueError("1 capital letter required.")

        if not re.search(r"[a-z]", password):
            raise ValueError("1 small letter  required")
        
        if not re.search(r"\d", password):
            raise ValueError("1 digit required")

        if not re.search(r"[<,./';=\-!@#$%^&*()/*+|]", password):
            raise ValueError("One symbol requires")

        
        return value


class UserLogin(UserBase):
    username: str
    password: SecretStr = Field(max_length=30)

