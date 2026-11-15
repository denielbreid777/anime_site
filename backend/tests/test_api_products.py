import pytest
from httpx import AsyncClient


PRODUCT = {
    "name": "Фігурка Мікаси",
    "description": "Фігурка 20 см з підставкою",
    "price": 1999,
    "stock": 10,
    "category": "figure"
}


async def create_test_product(client: AsyncClient, admin_headers, **changes):
    data = {**PRODUCT, **changes}
    response = await client.post("/products", json=data, headers=admin_headers)
    return response


async def create_test_anime(client: AsyncClient, admin_headers):
    response = await client.post(
        "/anime",
        json={"title": "Attack on Titan", "description": "Люди воюють з тітанами...", "year": 2013},
        headers=admin_headers
    )
    return response.json()["id"]


# ---------- Створення ----------

@pytest.mark.asyncio
async def test_create_product_as_admin(client: AsyncClient, admin_headers):
    response = await create_test_product(client, admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Фігурка Мікаси"
    assert data["price"] == 1999
    assert data["stock"] == 10
    assert data["category"] == "figure"
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_create_product_as_non_admin(client: AsyncClient, auth_headers):
    response = await client.post("/products", json=PRODUCT, headers=auth_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_create_product_unauthorized(client: AsyncClient):
    response = await client.post("/products", json=PRODUCT)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_product_wrong_price(client: AsyncClient, admin_headers):
    response = await create_test_product(client, admin_headers, price=0)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_product_wrong_category(client: AsyncClient, admin_headers):
    response = await create_test_product(client, admin_headers, category="car")
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_product_with_anime(client: AsyncClient, admin_headers):
    anime_id = await create_test_anime(client, admin_headers)
    response = await create_test_product(client, admin_headers, anime_id=anime_id)
    assert response.status_code == 201
    assert response.json()["anime_id"] == anime_id


@pytest.mark.asyncio
async def test_create_product_anime_not_found(client: AsyncClient, admin_headers):
    response = await create_test_product(client, admin_headers, anime_id=999)
    assert response.status_code == 404


# ---------- Отримання ----------

@pytest.mark.asyncio
async def test_get_products_list(client: AsyncClient, admin_headers):
    await create_test_product(client, admin_headers)
    await create_test_product(client, admin_headers, name="Футболка AoT", category="merch")

    response = await client.get("/products")
    assert response.status_code == 200
    assert len(response.json()) == 2


@pytest.mark.asyncio
async def test_get_products_filter_by_category(client: AsyncClient, admin_headers):
    await create_test_product(client, admin_headers)
    await create_test_product(client, admin_headers, name="Футболка AoT", category="merch")

    response = await client.get("/products?category=merch")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["category"] == "merch"


@pytest.mark.asyncio
async def test_get_products_filter_by_anime(client: AsyncClient, admin_headers):
    anime_id = await create_test_anime(client, admin_headers)
    await create_test_product(client, admin_headers, anime_id=anime_id)
    await create_test_product(client, admin_headers, name="Просто чашка", category="merch")

    response = await client.get(f"/products?anime_id={anime_id}")
    assert response.status_code == 200
    assert len(response.json()) == 1


@pytest.mark.asyncio
async def test_get_product_by_id(client: AsyncClient, admin_headers):
    product_id = (await create_test_product(client, admin_headers)).json()["id"]

    response = await client.get(f"/products/{product_id}")
    assert response.status_code == 200
    assert response.json()["id"] == product_id


@pytest.mark.asyncio
async def test_get_product_not_found(client: AsyncClient):
    response = await client.get("/products/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_product_invalid_id(client: AsyncClient):
    response = await client.get("/products/0")
    assert response.status_code == 400


# ---------- Редагування ----------

@pytest.mark.asyncio
async def test_update_product_as_admin(client: AsyncClient, admin_headers):
    product_id = (await create_test_product(client, admin_headers)).json()["id"]

    response = await client.patch(f"/products/{product_id}", json={"price": 2499, "stock": 5}, headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 2499
    assert data["stock"] == 5
    assert data["name"] == "Фігурка Мікаси"


@pytest.mark.asyncio
async def test_update_product_as_non_admin(client: AsyncClient, admin_headers, auth_headers):
    product_id = (await create_test_product(client, admin_headers)).json()["id"]

    response = await client.patch(f"/products/{product_id}", json={"price": 1}, headers=auth_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_update_product_not_found(client: AsyncClient, admin_headers):
    response = await client.patch("/products/999", json={"price": 2499}, headers=admin_headers)
    assert response.status_code == 404


# ---------- Видалення (ховаємо) ----------

@pytest.mark.asyncio
async def test_delete_product_as_admin(client: AsyncClient, admin_headers):
    product_id = (await create_test_product(client, admin_headers)).json()["id"]

    response = await client.delete(f"/products/{product_id}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["is_active"] is False

    # Після видалення товару не видно ні в списку, ні по id
    assert (await client.get(f"/products/{product_id}")).status_code == 404
    assert len((await client.get("/products")).json()) == 0


@pytest.mark.asyncio
async def test_restore_deleted_product(client: AsyncClient, admin_headers):
    product_id = (await create_test_product(client, admin_headers)).json()["id"]
    await client.delete(f"/products/{product_id}", headers=admin_headers)

    response = await client.patch(f"/products/{product_id}", json={"is_active": True}, headers=admin_headers)
    assert response.status_code == 200
    assert (await client.get(f"/products/{product_id}")).status_code == 200


@pytest.mark.asyncio
async def test_delete_product_as_non_admin(client: AsyncClient, admin_headers, auth_headers):
    product_id = (await create_test_product(client, admin_headers)).json()["id"]

    response = await client.delete(f"/products/{product_id}", headers=auth_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_delete_product_not_found(client: AsyncClient, admin_headers):
    response = await client.delete("/products/999", headers=admin_headers)
    assert response.status_code == 404
