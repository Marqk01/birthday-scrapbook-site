from pathlib import Path
import json
import os
import secrets
import shutil
from typing import Optional

from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads"
DATA_FILE = DATA_DIR / "scrapbook.json"

DATA_DIR.mkdir(exist_ok=True)
UPLOAD_DIR.mkdir(exist_ok=True)

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "change-this-password")
MAX_UPLOAD_SIZE = 100 * 1024 * 1024  # 100 MB safety limit per upload

app = FastAPI(title="Birthday Scrapbook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    password: str


class ScrapbookData(BaseModel):
    data: dict


def read_data() -> dict:
    if not DATA_FILE.exists():
        return {}
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


def write_data(data: dict) -> None:
    DATA_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def check_admin(x_admin_token: Optional[str]) -> None:
    if not x_admin_token or not secrets.compare_digest(x_admin_token, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Unauthorized")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/admin/login")
def admin_login(request: LoginRequest):
    if not secrets.compare_digest(request.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {"success": True, "token": ADMIN_PASSWORD}


@app.get("/api/scrapbook")
def get_scrapbook():
    return read_data()


@app.put("/api/scrapbook")
def save_scrapbook(payload: ScrapbookData, x_admin_token: Optional[str] = Header(default=None)):
    check_admin(x_admin_token)
    write_data(payload.data)
    return {"success": True}


@app.post("/api/media")
async def upload_media(
    file: UploadFile = File(...),
    x_admin_token: Optional[str] = Header(default=None),
):
    check_admin(x_admin_token)

    original_name = Path(file.filename or "upload").name
    extension = Path(original_name).suffix.lower()
    allowed_extensions = {
        ".jpg", ".jpeg", ".png", ".webp", ".gif",
        ".mp4", ".webm", ".mov", ".m4v",
    }

    if extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported media type")

    safe_name = f"{secrets.token_hex(16)}{extension}"
    destination = UPLOAD_DIR / safe_name

    size = 0
    try:
        with destination.open("wb") as output:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_UPLOAD_SIZE:
                    output.close()
                    destination.unlink(missing_ok=True)
                    raise HTTPException(status_code=413, detail="File is too large")
                output.write(chunk)
    finally:
        await file.close()

    return {
        "success": True,
        "filename": safe_name,
        "url": f"/uploads/{safe_name}",
        "originalName": original_name,
    }


# Uploaded media is served from /uploads/.
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Serve the scrapbook frontend when the backend is deployed as one Render service.
@app.get("/", include_in_schema=False)
def serve_index():
    return FileResponse(BASE_DIR / "index.html")


@app.get("/admin", include_in_schema=False)
def serve_admin():
    return FileResponse(BASE_DIR / "admin.html")


@app.get("/{path:path}", include_in_schema=False)
def serve_frontend(path: str):
    requested = BASE_DIR / path
    if requested.is_file() and BASE_DIR in requested.resolve().parents:
        return FileResponse(requested)
    raise HTTPException(status_code=404, detail="Not Found")
