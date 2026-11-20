"""add default values for created_at and updated_at

Revision ID: c5d7cb739e47
Revises: bbacc98a2a65
Create Date: 2026-11-19 19:05:24.398498

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c5d7cb739e47'
down_revision: Union[str, Sequence[str], None] = 'bbacc98a2a65'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Users table
    op.execute("ALTER TABLE users MODIFY COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
    op.execute("ALTER TABLE users MODIFY COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    
    # Anime table
    op.execute("ALTER TABLE anime MODIFY COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
    op.execute("ALTER TABLE anime MODIFY COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    
    # Posts table
    op.execute("ALTER TABLE posts MODIFY COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
    op.execute("ALTER TABLE posts MODIFY COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    
    # Comments table
    op.execute("ALTER TABLE comments MODIFY COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
    op.execute("ALTER TABLE comments MODIFY COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    
    # Products table
    op.execute("ALTER TABLE products MODIFY COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
    op.execute("ALTER TABLE products MODIFY COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")


def downgrade() -> None:
    """Downgrade schema."""
    # Users table
    op.execute("ALTER TABLE users MODIFY COLUMN created_at DATETIME NOT NULL")
    op.execute("ALTER TABLE users MODIFY COLUMN updated_at DATETIME NOT NULL")
    
    # Anime table
    op.execute("ALTER TABLE anime MODIFY COLUMN created_at DATETIME NOT NULL")
    op.execute("ALTER TABLE anime MODIFY COLUMN updated_at DATETIME NOT NULL")
    
    # Posts table
    op.execute("ALTER TABLE posts MODIFY COLUMN created_at DATETIME NOT NULL")
    op.execute("ALTER TABLE posts MODIFY COLUMN updated_at DATETIME NOT NULL")
    
    # Comments table
    op.execute("ALTER TABLE comments MODIFY COLUMN created_at DATETIME NOT NULL")
    op.execute("ALTER TABLE comments MODIFY COLUMN updated_at DATETIME NOT NULL")
    
    # Products table
    op.execute("ALTER TABLE products MODIFY COLUMN created_at DATETIME NOT NULL")
    op.execute("ALTER TABLE products MODIFY COLUMN updated_at DATETIME NOT NULL")
