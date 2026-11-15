"""add products table

Revision ID: bbacc98a2a65
Revises: df48ac792c09
Create Date: 2026-11-14 19:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bbacc98a2a65'
down_revision: Union[str, Sequence[str], None] = 'df48ac792c09'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('products',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=200), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.Column('stock', sa.Integer(), nullable=False),
    sa.Column('category', sa.Enum('merch', 'figure', name='productcategory'), nullable=False),
    sa.Column('image_url', sa.String(length=500), nullable=True),
    sa.Column('anime_id', sa.Integer(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['anime_id'], ['anime.id'], name=op.f('fk_products_anime_id_anime'), ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_products'))
    )
    op.create_index(op.f('ix_products_anime_id'), 'products', ['anime_id'], unique=False)
    op.create_index(op.f('ix_products_category'), 'products', ['category'], unique=False)
    op.create_index(op.f('ix_products_name'), 'products', ['name'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_products_name'), table_name='products')
    op.drop_index(op.f('ix_products_category'), table_name='products')
    op.drop_index(op.f('ix_products_anime_id'), table_name='products')
    op.drop_table('products')
