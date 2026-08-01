from flask import Flask, jsonify, render_template, request
import sqlite3
from pathlib import Path

app = Flask(__name__)
DB_PATH = Path(__file__).with_name("blog.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

def validate_blog(data):
    if not isinstance(data, dict):
        return "Invalid JSON request body."
    for field in ("title", "author", "content"):
        if not isinstance(data.get(field), str) or not data[field].strip():
            return f"{field.capitalize()} is required."
    if len(data["title"].strip()) > 150:
        return "Title must be 150 characters or fewer."
    if len(data["author"].strip()) > 80:
        return "Author must be 80 characters or fewer."
    return None

@app.get("/")
def index():
    return render_template("index.html")

@app.get("/api/blogs")
def get_blogs():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, title, author, content, created_at FROM blogs ORDER BY id DESC"
        ).fetchall()
    return jsonify([dict(row) for row in rows]), 200

@app.post("/api/blogs")
def create_blog():
    data = request.get_json(silent=True)
    error = validate_blog(data)
    if error:
        return jsonify({"error": error}), 400

    with get_db() as conn:
        cursor = conn.execute(
            "INSERT INTO blogs (title, author, content) VALUES (?, ?, ?)",
            (data["title"].strip(), data["author"].strip(), data["content"].strip())
        )
        blog_id = cursor.lastrowid
        row = conn.execute(
            "SELECT id, title, author, content, created_at FROM blogs WHERE id = ?",
            (blog_id,)
        ).fetchone()
    return jsonify(dict(row)), 201

@app.put("/api/blogs/<int:blog_id>")
def update_blog(blog_id):
    data = request.get_json(silent=True)
    error = validate_blog(data)
    if error:
        return jsonify({"error": error}), 400

    with get_db() as conn:
        existing = conn.execute("SELECT id FROM blogs WHERE id = ?", (blog_id,)).fetchone()
        if not existing:
            return jsonify({"error": "Blog not found."}), 404

        conn.execute(
            "UPDATE blogs SET title = ?, author = ?, content = ? WHERE id = ?",
            (data["title"].strip(), data["author"].strip(), data["content"].strip(), blog_id)
        )
        row = conn.execute(
            "SELECT id, title, author, content, created_at FROM blogs WHERE id = ?",
            (blog_id,)
        ).fetchone()
    return jsonify(dict(row)), 200

@app.delete("/api/blogs/<int:blog_id>")
def delete_blog(blog_id):
    with get_db() as conn:
        cursor = conn.execute("DELETE FROM blogs WHERE id = ?", (blog_id,))
        if cursor.rowcount == 0:
            return jsonify({"error": "Blog not found."}), 404
    return jsonify({"message": "Blog deleted successfully."}), 200

@app.errorhandler(404)
def not_found(_):
    return jsonify({"error": "Resource not found."}), 404

@app.errorhandler(500)
def server_error(_):
    return jsonify({"error": "An unexpected server error occurred."}), 500

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
