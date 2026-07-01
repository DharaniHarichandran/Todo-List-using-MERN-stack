import React, { useState, useEffect } from "react";
import "../styles/Todo.css";

const API_URL = import.meta.env.VITE_SERVER_URL;


function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await fetch(`${API_URL}/todos`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  }

  async function addHandler() {
    try {
      if (!title.trim()) {
        alert("Title is required");
        return;
      }

      if (editingId) {
        await fetch(`${API_URL}/todos/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        });

        setEditingId(null);
      } else {
        await fetch(`${API_URL}/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
          }),
        });
      }

      setTitle("");
      setDescription("");

      fetchTodos();
    } catch (error) {
      console.error("Add/Update Error:", error);
    }
  }

  async function deleteTodo(id) {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });

      fetchTodos();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  }

  function editTodo(todo) {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditingId(todo._id);
  }

  return (
    <div className="todo-container">
      <h1>My Todo List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={addHandler} className="add-btn">
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <div className="todo-content">
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
            </div>

            <div className="todo-actions">
              <button
                className="edit-btn"
                onClick={() => editTodo(todo)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;