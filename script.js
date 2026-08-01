const form = document.getElementById("blog-form");
const blogId = document.getElementById("blog-id");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const contentInput = document.getElementById("content");
const list = document.getElementById("blog-list");
const count = document.getElementById("blog-count");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");

function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = `message ${type}`;
  setTimeout(() => { message.textContent = ""; }, 3500);
}
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
async function loadBlogs() {
  try {
    const response = await fetch("/api/blogs");
    const blogs = await response.json();
    count.textContent = `${blogs.length} blog${blogs.length === 1 ? "" : "s"}`;
    if (!blogs.length) {
      list.innerHTML = '<div class="empty"><h3>No blogs yet</h3><p>Create your first blog using the form.</p></div>';
      return;
    }
    list.innerHTML = blogs.map(blog => `
      <article class="blog-card">
        <h3>${escapeHtml(blog.title)}</h3>
        <div class="meta">By ${escapeHtml(blog.author)} · ${new Date(blog.created_at + "Z").toLocaleDateString()}</div>
        <div class="content">${escapeHtml(blog.content)}</div>
        <div class="card-actions">
          <button class="secondary" onclick="editBlog(${blog.id})">Edit</button>
          <button class="danger" onclick="deleteBlog(${blog.id})">Delete</button>
        </div>
      </article>`).join("");
  } catch {
    list.innerHTML = '<div class="empty">Unable to load blogs. Please refresh the page.</div>';
  }
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    content: contentInput.value.trim()
  };
  const id = blogId.value;
  const response = await fetch(id ? `/api/blogs/${id}` : "/api/blogs", {
    method: id ? "PUT" : "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) return showMessage(data.error || "Request failed.", "error");
  showMessage(id ? "Blog updated successfully." : "Blog published successfully.");
  resetForm();
  loadBlogs();
});
async function editBlog(id) {
  const response = await fetch("/api/blogs");
  const blogs = await response.json();
  const blog = blogs.find(item => item.id === id);
  if (!blog) return showMessage("Blog not found.", "error");
  blogId.value = blog.id;
  titleInput.value = blog.title;
  authorInput.value = blog.author;
  contentInput.value = blog.content;
  document.getElementById("form-title").textContent = "Edit Blog";
  submitBtn.textContent = "Update Blog";
  cancelBtn.classList.remove("hidden");
  window.scrollTo({top: 0, behavior: "smooth"});
}
async function deleteBlog(id) {
  if (!confirm("Are you sure you want to delete this blog?")) return;
  const response = await fetch(`/api/blogs/${id}`, {method: "DELETE"});
  const data = await response.json();
  if (!response.ok) return showMessage(data.error || "Delete failed.", "error");
  showMessage(data.message);
  loadBlogs();
}
function resetForm() {
  form.reset();
  blogId.value = "";
  document.getElementById("form-title").textContent = "Create a Blog";
  submitBtn.textContent = "Publish Blog";
  cancelBtn.classList.add("hidden");
}
cancelBtn.addEventListener("click", resetForm);
loadBlogs();
