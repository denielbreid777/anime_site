import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_comment(client: AsyncClient, auth_headers, admin_headers):
    # Спочатку створюємо пост
    post_response = await client.post(
        "/posts",
        json={
            "title": "Тестовий пост",
            "content": "Контент поста..."
        },
        headers=auth_headers
    )
    post_id = post_response.json()["id"]

    # Створюємо коментар
    response = await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Це коментарій"},
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "Це коментарій"
    assert data["post_id"] == post_id


@pytest.mark.asyncio
async def test_create_comment_unauthorized(client: AsyncClient, admin_headers):
    post_response = await client.post(
        "/posts",
        json={
            "title": "Тестовий пост",
            "content": "Контент поста..."
        },
        headers=admin_headers
    )
    post_id = post_response.json()["id"]

    response = await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Це коментарій"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_create_comment_invalid_post_id(client: AsyncClient, auth_headers):
    response = await client.post(
        "/posts/0/comments",
        json={"content": "Це коментарій"},
        headers=auth_headers
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_create_comment_post_not_found(client: AsyncClient, auth_headers):
    response = await client.post(
        "/posts/99999/comments",
        json={"content": "Це коментарій"},
        headers=auth_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_comments(client: AsyncClient, auth_headers):
    # Створюємо пост
    post_response = await client.post(
        "/posts",
        json={
            "title": "Тестовий пост",
            "content": "Контент поста..."
        },
        headers=auth_headers
    )
    post_id = post_response.json()["id"]

    # Створюємо коментарі
    await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Перший коментарій"},
        headers=auth_headers
    )

    await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Другий коментарій"},
        headers=auth_headers
    )

    # Отримуємо список коментарів
    response = await client.get(f"/posts/{post_id}/comments")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


@pytest.mark.asyncio
async def test_list_comments_invalid_post_id(client: AsyncClient):
    response = await client.get("/posts/0/comments")
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_list_comments_post_not_found(client: AsyncClient):
    response = await client.get("/posts/99999/comments")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_own_comment(client: AsyncClient, auth_headers):
    # Створюємо пост і коментарій
    post_response = await client.post(
        "/posts",
        json={
            "title": "Тестовий пост",
            "content": "Контент поста..."
        },
        headers=auth_headers
    )
    post_id = post_response.json()["id"]

    comment_response = await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Початковий коментарій"},
        headers=auth_headers
    )
    comment_id = comment_response.json()["id"]

    # Оновлюємо коментарій
    response = await client.patch(
        f"/comments/{comment_id}",
        json={"content": "Оновлений коментарій"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Оновлений коментарій"


@pytest.mark.asyncio
async def test_update_other_user_comment(client: AsyncClient, auth_headers, create_user):
    user2_response = await create_user("user2", "user2@example.com", "12Ukrain34!")
    user2_token = user2_response.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}

    # Створюємо пост користувачем 1
    post_response = await client.post(
        "/posts",
        json={
            "title": "Тестовий пост",
            "content": "Контент поста..."
        },
        headers=auth_headers
    )
    post_id = post_response.json()["id"]

    # Створюємо коментарій користувачем 1
    comment_response = await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Коментарій користувача 1"},
        headers=auth_headers
    )
    comment_id = comment_response.json()["id"]

    # Користувач 2 намагається оновити
    response = await client.patch(
        f"/comments/{comment_id}",
        json={"content": "Спроба змінити"},
        headers=user2_headers
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_update_comment_invalid_id(client: AsyncClient, auth_headers):
    response = await client.patch(
        "/comments/0",
        json={"content": "Оновлений коментарій"},
        headers=auth_headers
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_update_comment_not_found(client: AsyncClient, auth_headers):
    response = await client.patch(
        "/comments/99999",
        json={"content": "Оновлений коментарій"},
        headers=auth_headers
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_own_comment(client: AsyncClient, auth_headers):
    # Створюємо пост і коментарій
    post_response = await client.post(
        "/posts",
        json={
            "title": "Тестовий пост",
            "content": "Контент поста..."
        },
        headers=auth_headers
    )
    post_id = post_response.json()["id"]

    comment_response = await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Коментарій для видалення"},
        headers=auth_headers
    )
    comment_id = comment_response.json()["id"]

    # Видаляємо коментарій
    response = await client.delete(f"/comments/{comment_id}", headers=auth_headers)
    assert response.status_code == 204

    # Перевіряємо, що коментарій видалено (перевіряємо через список коментарів поста)
    comments_response = await client.get(f"/posts/{post_id}/comments")
    comments = comments_response.json()
    assert not any(c["id"] == comment_id for c in comments)


@pytest.mark.asyncio
async def test_delete_other_user_comment_as_non_admin(client: AsyncClient, auth_headers, create_user):
    user2_response = await create_user("user2", "user2@example.com", "12Ukrain34!")
    user2_token = user2_response.json()["access_token"]
    user2_headers = {"Authorization": f"Bearer {user2_token}"}

    # Створюємо пост і коментарій користувачем 1
    post_response = await client.post(
        "/posts",
        json={
            "title": "Тестовий пост",
            "content": "Контент поста..."
        },
        headers=auth_headers
    )
    post_id = post_response.json()["id"]

    comment_response = await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Коментарій користувача 1"},
        headers=auth_headers
    )
    comment_id = comment_response.json()["id"]

    # Користувач 2 намагається видалити
    response = await client.delete(f"/comments/{comment_id}", headers=user2_headers)
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_delete_other_user_comment_as_admin(client: AsyncClient, auth_headers, admin_headers):
    # Створюємо пост і коментарій звичайним користувачем
    post_response = await client.post(
        "/posts",
        json={
            "title": "Тестовий пост",
            "content": "Контент поста..."
        },
        headers=auth_headers
    )
    post_id = post_response.json()["id"]

    comment_response = await client.post(
        f"/posts/{post_id}/comments",
        json={"content": "Коментарій користувача"},
        headers=auth_headers
    )
    comment_id = comment_response.json()["id"]

    # Адмін видаляє
    response = await client.delete(f"/comments/{comment_id}", headers=admin_headers)
    assert response.status_code == 204

    # Перевіряємо, що коментарій видалено (перевіряємо через список коментарів поста)
    comments_response = await client.get(f"/posts/{post_id}/comments")
    comments = comments_response.json()
    assert not any(c["id"] == comment_id for c in comments)


@pytest.mark.asyncio
async def test_delete_comment_invalid_id(client: AsyncClient, auth_headers):
    response = await client.delete("/comments/0", headers=auth_headers)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_delete_comment_not_found(client: AsyncClient, auth_headers):
    response = await client.delete("/comments/99999", headers=auth_headers)
    assert response.status_code == 404
