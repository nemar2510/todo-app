import { useEffect, useState } from "react";
import API from "../api/api";
import { FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// 🔥 Firebase
import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";

const suggestions = [
  "Alarm", "Bath", "Breakfast", "Call", "Coding",
  "Cleaning", "Dance", "Driving", "Exercise",
  "Email", "Gym", "Homework", "Meeting",
  "Meditation", "Reading", "Running",
  "Shopping", "Study", "Sleep", "Workout"
];

function Dashboard() {
  console.log("Dashboard loaded");

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState(null);
  const [filtered, setFiltered] = useState([]);

  // 🔥 UPDATED NOTIFICATION LOGIC (FINAL)
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const permission = await Notification.requestPermission();
        console.log("Permission:", permission);

        if (permission === "granted") {

          // ✅ REGISTER SERVICE WORKER
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );

          console.log("Service Worker registered:", registration);

          // ✅ GET TOKEN WITH SERVICE WORKER
          const currentToken = await getToken(messaging, {
            vapidKey: "BEZNMqPCUCFd9OE6AqxnIf7w_L4zUPJmrciaSnn7JwHtPbdCIBEjeQ6cmWVykYn52pUNj1m2Cr61_b-oay0eT7s",
            serviceWorkerRegistration: registration
          });

          if (currentToken) {
            console.log("🔥 DEVICE TOKEN:", currentToken);

            // store token locally
            localStorage.setItem("deviceToken", currentToken);

          } else {
            console.log("❌ No registration token available");
          }
        }
      } catch (err) {
        console.log("❌ Token error:", err);
      }
    };

    setupNotifications();

    // 🔔 Foreground notification (when app open)
    onMessage(messaging, (payload) => {
      alert(payload.notification.title + " - " + payload.notification.body);
    });

  }, []);

  // ✅ EXISTING AUTH CHECK (UNCHANGED)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
    }

    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setTasks(res.data);
    } catch (err) {
      alert("Session expired. Login again.");
      localStorage.removeItem("token");
      navigate("/");
    }
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
    if (!title.trim()) return alert("Enter task");

    const body = { title, time };

    try {
      if (editId) {
        await API.put(`/tasks/${editId}`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setEditId(null);
      } else {
        await API.post("/tasks", body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
      }

      setTitle("");
      setTime("");
      setFiltered([]);
      fetchTasks();

    } catch {
      alert("Error saving task");
    }
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      completed: !task.completed
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
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
      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>

      <div style={{
        width: "500px",
        background: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(15px)",
        padding: "25px",
        borderRadius: "15px",
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h2>🚀 Smart To-Do</h2>

          <button
            onClick={logout}
            style={{
              background: "#ff4d4d",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              color: "white"
            }}
          >
            Logout
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "14px" }}>
          ⏰ Stay on time | 📅 Organize tasks | ⚡ Boost productivity
        </p>

        {/* EVERYTHING BELOW UNCHANGED */}

        <div style={{ position: "relative", marginTop: "15px" }}>
          <input
            value={title}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter task"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none"
            }}
          />

          {filtered.length > 0 && (
            <div style={{
              position: "absolute",
              width: "100%",
              background: "white",
              color: "black",
              borderRadius: "8px",
              marginTop: "5px",
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
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "8px",
            width: "100%"
          }}
        />

        <button
          onClick={addOrUpdateTask}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "12px",
            background: "#00c6ff",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold"
          }}
        >
          {editId ? "Update Task" : "Add Task"}
        </button>

        <hr />

        {tasks.map(task => (
          <div key={task._id} style={{
            background: task.completed ? "#00c6ff" : "#ffffff20",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <p style={{
                margin: 0,
                textDecoration: task.completed ? "line-through" : "none"
              }}>
                {task.title}
              </p>
              <small>{task.time}</small>
            </div>

           <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
  <button onClick={() => startEdit(task)}><FaEdit /></button>
  <button onClick={() => toggleComplete(task)}><FaCheck /></button>
  <button onClick={() => deleteTask(task._id)}><FaTrash /></button>

  <button
    onClick={() => {
      Notification.requestPermission().then((permission) => {
        console.log("Permission:", permission);
      });
    }}
    style={{
      fontSize: "10px",
      padding: "4px",
      background: "#00c6ff",
      border: "none",
      borderRadius: "4px",
      color: "white"
    }}
  >
    Enable Notifications
  </button>
</div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Dashboard;