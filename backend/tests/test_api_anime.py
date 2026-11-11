import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_anime_as_admin(client: AsyncClient, admin_headers):
    response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013,
            "episodes": 87
        },
        headers=admin_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Attack on Titan"
    assert data["year"] == 2013
    assert "id" in data


@pytest.mark.asyncio
async def test_create_anime_as_non_admin(client: AsyncClient, auth_headers):
    response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=auth_headers
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_create_anime_unauthorized(client: AsyncClient):
    response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        }
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_anime_duplicate_title(client: AsyncClient, admin_headers):
    await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )

    response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Інший опис...",
            "year": 2020
        },
        headers=admin_headers
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_list_anime(client: AsyncClient, admin_headers):
    await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )

    await client.post(
        "/anime",
        json={
            "title": "Naruto",
            "description": "Історія про ніндзя...",
            "year": 2002
        },
        headers=admin_headers
    )

    response = await client.get("/anime")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert any(anime["title"] == "Attack on Titan" for anime in data)
    assert any(anime["title"] == "Naruto" for anime in data)


@pytest.mark.asyncio
async def test_get_anime_by_id(client: AsyncClient, admin_headers):
    create_response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )
    anime_id = create_response.json()["id"]

    response = await client.get(f"/anime/{anime_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Attack on Titan"
    assert data["id"] == anime_id


@pytest.mark.asyncio
async def test_get_anime_not_found(client: AsyncClient):
    response = await client.get("/anime/99999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_anime_as_admin(client: AsyncClient, admin_headers):
    create_response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )
    anime_id = create_response.json()["id"]

    response = await client.patch(
        f"/anime/{anime_id}",
        json={"description": "Оновлений опис..."},
        headers=admin_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Оновлений опис..."
    assert data["title"] == "Attack on Titan"


@pytest.mark.asyncio
async def test_update_anime_as_non_admin(client: AsyncClient, auth_headers, admin_headers):
    create_response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )
    anime_id = create_response.json()["id"]

    response = await client.patch(
        f"/anime/{anime_id}",
        json={"description": "Оновлений опис..."},
        headers=auth_headers
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_update_anime_not_found(client: AsyncClient, admin_headers):
    response = await client.patch(
        "/anime/99999",
        json={"description": "Оновлений опис..."},
        headers=admin_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_anime_as_admin(client: AsyncClient, admin_headers):
    create_response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )
    anime_id = create_response.json()["id"]

    response = await client.delete(f"/anime/{anime_id}", headers=admin_headers)
    assert response.status_code == 204

    get_response = await client.get(f"/anime/{anime_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_anime_as_non_admin(client: AsyncClient, auth_headers, admin_headers):
    create_response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )
    anime_id = create_response.json()["id"]

    response = await client.delete(f"/anime/{anime_id}", headers=auth_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_delete_anime_not_found(client: AsyncClient, admin_headers):
    response = await client.delete("/anime/99999", headers=admin_headers)
    assert response.status_code == 404
