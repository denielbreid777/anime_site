# Anime Social Network

A social network with anime theme built with FastAPI (backend) and Next.js (frontend).

## Backend Tests

### Installation

To run backend tests, you need to install the development dependencies:

```bash
cd Project
pip install -r backend/requirements-dev.txt
```

### Running Tests

Run all tests from the project root:

```bash
pytest
```

Run tests with coverage:

```bash
pytest --cov=backend/app --cov-report=term-missing
```

### Test Infrastructure

The test suite uses:
- **pytest** as the test runner
- **pytest-asyncio** for async test support
- **httpx** for HTTP client testing
- **aiosqlite** for in-memory SQLite database (no MySQL required for tests)

Tests are completely isolated from the production MySQL database. Each test uses a fresh in-memory SQLite database that is created and destroyed for each test case.

### Current Coverage

Current test coverage is **90%** for `backend/app/`.

### Test Files

- `test_smoke.py` - Basic OpenAPI endpoint test
- `test_security.py` - Password hashing, token creation/decoding tests
- `test_schemas.py` - Pydantic schema validation tests
- `test_api_register.py` - Registration endpoint tests
- `test_api_login.py` - Login endpoint tests
- `test_api_me.py` - User profile endpoint tests
- `test_coverage.py` - Dependency injection tests
- `test_crud_coverage.py` - CRUD operation tests
