from sqlalchemy.orm import Mapped, mapped_column

from server.db.session import Base


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    email: Mapped[str]
    pass_hash: Mapped[str]
