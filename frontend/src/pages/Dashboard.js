import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const suggestions = [
  "Alarm","Bath","Breakfast","Call","Coding",
  "Cleaning","Dance","Driving","Exercise",
  "Email","Gym","Homework","Meeting",
  "Meditation","Reading","Running",
  "Shopping","Study","Sleep","Workout"
];

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState(null);
  const [filtered, setFiltered] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const handleChange = (value) => {
    setTitle(value);

    if (!value) return setFiltered([]);

    setFiltered(
      suggestions.filter(item =>
        item.toLowerCase().startsWith(value.toLowerCase())
      )
    );
  };

  const addOrUpdateTask = async () => {
    if (!title) return alert("Enter task");

    if (editId) {
      await API.put(`/tasks/${editId}`, { title, time });
      setEditId(null);
    } else {
      await API.post("/tasks", { title, time });
    }

    setTitle("");
    setTime("");
    setFiltered([]);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setTitle(task.title);
    setTime(task.time || "");
    setEditId(task._id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>

      <div style={{
        width: "420px",
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)",
        padding: "30px",
        borderRadius: "16px",
        color: "white",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        boxSizing: "border-box"
      }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2 style={{ margin: 0 }}>🚀 Smart To-Do</h2>

          <button onClick={logout} style={{
            background: "#ff4d4d",
            border: "none",
            color: "white",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
            Logout
          </button>
        </div>

        <p style={{
          textAlign: "center",
          margin: "15px 0"
        }}>
          ⏰ Stay on time | 📅 Organize tasks | ⚡ Boost productivity
        </p>

        {/* INPUT + DROPDOWN */}
        <div style={{ position: "relative" }}>
          <input
            value={title}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter task..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              marginBottom: "10px",
              boxSizing: "border-box",
              outline: "none"
            }}
          />

          {filtered.length > 0 && (
            <div style={{
              position: "absolute",
              width: "100%",
              background: "white",
              color: "black",
              borderRadius: "8px",
              marginTop: "-5px",
              zIndex: 10
            }}>
              {filtered.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setTitle(item);
                    setFiltered([]);
                  }}
                  style={{
                    padding: "10px",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) =>
                    e.target.style.background = "#eee"
                  }
                  onMouseLeave={(e) =>
                    e.target.style.background = "white"
                  }
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TIME INPUT */}
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            marginBottom: "10px",
            boxSizing: "border-box",
            outline: "none"
          }}
        />

        {/* BUTTON */}
        <button
          onClick={addOrUpdateTask}
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {editId ? "Update Task" : "Add Task"}
        </button>

        <hr style={{ margin: "20px 0", opacity: 0.3 }} />

        {/* TASK LIST */}
        {tasks.map(task => (
          <div key={task._id} style={{
            background: "#ffffff15",
            padding: "12px",
            borderRadius: "10px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <p style={{ margin: 0 }}>{task.title}</p>
              <small>{task.time}</small>
            </div>

            <div>
              <button onClick={() => startEdit(task)}>✏️</button>
              <button onClick={() => deleteTask(task._id)}>❌</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Dashboard;