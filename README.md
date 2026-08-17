# Azure FastAPI React Frontend

Polished React + Vite frontend connected to the deployed Azure FastAPI backend.

## Backend
Configured API base URL:
https://fastapi-app.wonderfulmeadow-0eabcbb1.uaenorth.azurecontainerapps.io

Swagger:
https://fastapi-app.wonderfulmeadow-0eabcbb1.uaenorth.azurecontainerapps.io/docs

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Important: CORS
Because this frontend runs in a browser and calls the Azure FastAPI API from a different origin, the FastAPI backend must allow the frontend origin.

For local development, a typical FastAPI setup is:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

When you deploy the frontend, replace `http://localhost:5173` with the final frontend domain (or temporarily allow both during testing).

Do not put PostgreSQL credentials or other secrets in this frontend.
