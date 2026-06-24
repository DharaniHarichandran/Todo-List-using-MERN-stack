import React from "react";
import { useState, useEffect } from "react";
import "../styles/Todo.css";
function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch todos when page loads
  useEffect(() => {
    fetchTodos();
  }, []);

  // GET TODOS
  async function fetchTodos() {
    try {
      const response = await fetch("http://localhost:3000/todos");

      const data = await response.json();

      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  }

  // ADD OR UPDATE TODO
  async function addHandler() {
    try {
      if (editingId) {
        // UPDATE

        await fetch(
          `http://localhost:3000/todos/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              description,
            }),
          }
        );

        setEditingId(null);
      } else {
        // CREATE

        await fetch("http://localhost:3000/todos", {
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
      console.log(error);
    }
  }

  // DELETE
  async function deleteTodo(id) {
    try {
      await fetch(
        `http://localhost:3000/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  }

  // EDIT
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

        <button
          onClick={addHandler}
          className="add-btn"
        >
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