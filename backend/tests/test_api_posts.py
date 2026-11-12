import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_post(client: AsyncClient, auth_headers):
    response = await client.post(
        "/posts",
        json={
            "title": "Мій перший пост",
            "content": "Це контент поста..."
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Мій перший пост"
    assert data["type"] == "post"
    assert "id" in data


@pytest.mark.asyncio
async def test_create_post_unauthorized(client: AsyncClient):
    response = await client.post(
        "/posts",
        json={
            "title": "Мій перший пост",
            "content": "Це контент поста..."
        }
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_review(client: AsyncClient, auth_headers, admin_headers):
    anime_response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )
    anime_id = anime_response.json()["id"]

    response = await client.post(
        "/reviews",
        json={
            "title": "Рецензія на Атаку Тітанів",
            "content": "Чудове аніме...",
            "anime_id": anime_id,
            "rating": 9
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Рецензія на Атаку Тітанів"
    assert data["type"] == "review"
    assert data["anime_id"] == anime_id
    assert data["rating"] == 9


@pytest.mark.asyncio
async def test_create_fanart(client: AsyncClient, auth_headers):
    response = await client.post(
        "/fanart",
        json={
            "title": "Мій фан-арт",
            "content": "Опис фан-арту...",
            "image_url": "https://example.com/image.jpg"
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Мій фан-арт"
    assert data["type"] == "fanart"
    assert data["image_url"] == "https://example.com/image.jpg"


@pytest.mark.asyncio
async def test_create_fanart_with_anime(client: AsyncClient, auth_headers, admin_headers):
    anime_response = await client.post(
        "/anime",
        json={
            "title": "Attack on Titan",
            "description": "Люди воюють з тітанами...",
            "year": 2013
        },
        headers=admin_headers
    )
    anime_id = anime_response.json()["id"]

    response = await client.post(
        "/fanart",
        json={
            "title": "Фан-арт Ерена",
            "content": "Малюнок Ерена...",
            "image_url": "https://example.com/eren.jpg",
            "anime_id": anime_id
        },
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["anime_id"] == anime_id


@pytest.mark.asyncio
async def test_list_posts(client: AsyncClient, auth_headers):
    await client.post(
        "/posts",
        json={
            "title": "Пост 1",
            "content": "Контент 1..."
        },
        headers=auth_headers
    )

    await client.post(
        "/posts",
        json={
            "title": "Пост 2",
            "content": "Контент 2..."
        },
        headers=auth_headers
    )

    response = await client.get("/posts")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


@pytest.mark.asyncio
async def test_get_post_by_id(client: AsyncClient, auth_headers):
    create_response = await client.post(
        "/posts",
        json={
            "title": "Мій пост",
            "content": "Контент..."
        },
        headers=auth_headers
    )
    post_id = create_response.json()["id"]

    response = await client.get(f"/posts/{post_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Мій пост"
    assert data["id"] == post_id


@pytest.mark.asyncio
async def test_get_post_not_found(client: AsyncClient):
    response = await client.get("/posts/99999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_own_post(client: AsyncClient, auth_headers):
    create_response = await client.post(
        "/posts",
        json={
            "title": "Мій пост",
            "content": "Контент..."
        },
        headers=auth_headers
    )
    post_id = create_response.json()["id"]

    response = await client.patch(
        f"/posts/{post_id}",
        json={"title": "Оновлений заголовок"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Оновлений заголовок"


@pytest.mark.asyncio
async def test_update_other_user_post(client: AsyncClient, auth_headers, create_user):
    user2_response = await create_user("user2", "user2@example.com", "12Ukrain34!")
    user2_token = user2_response.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}

    create_response = await client.post(
        "/posts",
        json={
            "title": "Пост користувача 1",
            "content": "Контент..."
        },
        headers=auth_headers
    )
    post_id = create_response.json()["id"]

    response = await client.patch(
        f"/posts/{post_id}",
        json={"title": "Спроба змінити"},
        headers=user2_headers
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_update_post_not_found(client: AsyncClient, auth_headers):
    response = await client.patch(
        "/posts/99999",
        json={"title": "Оновлений заголовок"},
        headers=auth_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_own_post(client: AsyncClient, auth_headers):
    create_response = await client.post(
        "/posts",
        json={
            "title": "Мій пост",
            "content": "Контент..."
        },
        headers=auth_headers
    )
    post_id = create_response.json()["id"]

    response = await client.delete(f"/posts/{post_id}", headers=auth_headers)
    assert response.status_code == 204

    get_response = await client.get(f"/posts/{post_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_other_user_post_as_non_admin(client: AsyncClient, auth_headers, create_user):
    user2_response = await create_user("user2", "user2@example.com", "12Ukrain34!")
    user2_token = user2_response.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}

    create_response = await client.post(
        "/posts",
        json={
            "title": "Пост користувача 1",
            "content": "Контент..."
        },
        headers=auth_headers
    )
    post_id = create_response.json()["id"]

    response = await client.delete(f"/posts/{post_id}", headers=user2_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_delete_other_user_post_as_admin(client: AsyncClient, auth_headers, admin_headers):
    create_response = await client.post(
        "/posts",
        json={
            "title": "Пост користувача",
            "content": "Контент..."
        },
        headers=auth_headers
    )
    post_id = create_response.json()["id"]

    response = await client.delete(f"/posts/{post_id}", headers=admin_headers)
    assert response.status_code == 204

    get_response = await client.get(f"/posts/{post_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_post_not_found(client: AsyncClient, auth_headers):
    response = await client.delete("/posts/99999", headers=auth_headers)
    assert response.status_code == 404
