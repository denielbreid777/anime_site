import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_smoke_openapi(client: AsyncClient):
    response = await client.get("/openapi.json")
    assert response.status_code == 200
