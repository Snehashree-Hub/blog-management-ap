# BlogFlow - Blog Management Application

## Project Overview
BlogFlow is a simple full-stack Blog Management web application. Users can create, view, edit, and delete blog posts through a responsive interface. The backend exposes RESTful CRUD APIs and stores data in SQLite.

## Features
- Display all blogs
- Add a new blog
- Edit an existing blog
- Delete a blog with confirmation
- Responsive UI for desktop and mobile
- Backend validation
- Meaningful API error responses
- SQLite database persistence

## Technologies Used
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Python, Flask
- Database: SQLite
- Version Control: Git and GitHub

## Installation and Setup

### 1. Clone the repository
```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
cd blog-management-app
```

### 2. Create and activate a virtual environment
Windows PowerShell:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Windows Command Prompt:
```cmd
venv\Scripts\activate
```

macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the application
```bash
python app.py
```

### 5. Open in a browser
Visit:
`http://127.0.0.1:5000`

The SQLite database is created automatically when the application starts.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/blogs` | Retrieve all blogs |
| POST | `/api/blogs` | Create a new blog |
| PUT | `/api/blogs/<id>` | Update a blog |
| DELETE | `/api/blogs/<id>` | Delete a blog |

### Example POST request
```json
{
  "title": "Introduction to AI",
  "author": "Sneha Shree",
  "content": "Artificial Intelligence is transforming modern applications."
}
```

## Validation and Error Handling
- Title, author, and content are required.
- Title is limited to 150 characters.
- Author is limited to 80 characters.
- Missing blogs return HTTP 404.
- Invalid input returns HTTP 400.
- Unexpected server errors return HTTP 500.

## Screenshots
Add screenshots to the `screenshots/` folder before submission.

## Assumptions
- No authentication is required because it was not included in the assessment requirements.
- A single user can manage all blog posts.
- SQLite is used to keep setup simple and portable.

## Author
Sneha Shree
