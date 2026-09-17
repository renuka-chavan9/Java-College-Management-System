import { useEffect, useState } from "react";
import "./index.css";

const emptyForm = {
  name: "",
  age: "",
  city: "",
  course: "",
  email: ""
};

function App() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const response = await fetch("/api/students");

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      setStudents(data);

    } catch (error) {

      console.error(error);
      setMessage("Unable to load students");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const url = editingId
        ? `/api/students/${editingId}`
        : "/api/students";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          age: Number(form.age)
        })
      });

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      setMessage(
        editingId
          ? "Student updated successfully"
          : "Student added successfully"
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      fetchStudents();

    } catch (error) {

      console.error(error);
      setMessage("Something went wrong");
    }
  };

  const editStudent = (student) => {

    setForm({
      name: student.name,
      age: student.age,
      city: student.city,
      course: student.course,
      email: student.email
    });

    setEditingId(student.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteStudent = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMessage("Student deleted successfully");

      fetchStudents();

    } catch (error) {

      console.error(error);
      setMessage("Unable to delete student");
    }
  };

  const filteredStudents = students.filter((student) => {

    const text = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(text) ||
      student.city?.toLowerCase().includes(text) ||
      student.course?.toLowerCase().includes(text) ||
      student.email?.toLowerCase().includes(text)
    );
  });

  const cancelForm = () => {

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="app">

      <header className="header">

        <div className="header-content">

          <div>
            <p className="tag">COLLEGE MANAGEMENT</p>

            <h1>
              Student
              <span> Management</span>
            </h1>

            <p className="subtitle">
              Manage students easily with a modern CRUD dashboard.
            </p>
          </div>

          <div className="header-icon">
            🎓
          </div>

        </div>

      </header>

      <main className="container">

        {message && (
          <div className="message">
            {message}

            <button onClick={() => setMessage("")}>
              ×
            </button>
          </div>
        )}

        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon">👨‍🎓</div>
            <div>
              <p>Total Students</p>
              <h2>{students.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div>
              <p>Courses</p>
              <h2>
                {new Set(
                  students.map((student) => student.course)
                ).size}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div>
              <p>Cities</p>
              <h2>
                {new Set(
                  students.map((student) => student.city)
                ).size}
              </h2>
            </div>
          </div>

        </section>

        {showForm && (
          <section className="form-card">

            <div className="section-title">
              <div>
                <p className="tag">STUDENT FORM</p>

                <h2>
                  {editingId
                    ? "Update Student"
                    : "Add New Student"}
                </h2>
              </div>

              <button
                className="close-btn"
                onClick={cancelForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="input-group">
                  <label>Full Name</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Age</label>

                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    min="1"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>City</label>

                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Course</label>

                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select course
                    </option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    <option value="MBA">MBA</option>
                    <option value="BBA">BBA</option>
                    <option value="BSc">BSc</option>
                    <option value="MSc">MSc</option>
                  </select>
                </div>

                <div className="input-group full">
                  <label>Email</label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@gmail.com"
                    required
                  />
                </div>

              </div>

              <div className="form-buttons">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={cancelForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingId
                    ? "Update Student"
                    : "Add Student"}
                </button>

              </div>

            </form>

          </section>
        )}

        <section className="students-section">

          <div className="toolbar">

            <div>
              <p className="tag">STUDENT DIRECTORY</p>

              <h2>All Students</h2>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setShowForm(true);
              }}
            >
              + Add Student
            </button>

          </div>

          <div className="search-box">

            <span>🔍</span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, city, course or email..."
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>

          {loading ? (

            <div className="empty">
              <div className="loader"></div>
              <p>Loading students...</p>
            </div>

          ) : filteredStudents.length === 0 ? (

            <div className="empty">
              <div className="empty-icon">🎓</div>
              <h3>No students found</h3>
              <p>
                Add a new student or try another search.
              </p>
            </div>

          ) : (

            <div className="student-grid">

              {filteredStudents.map((student) => (

                <article
                  className="student-card"
                  key={student.id}
                >

                  <div className="student-top">

                    <div className="avatar">
                      {student.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="student-name">

                      <h3>{student.name}</h3>

                      <span>
                        {student.course}
                      </span>

                    </div>

                  </div>

                  <div className="student-details">

                    <div>
                      <small>AGE</small>
                      <strong>{student.age} Years</strong>
                    </div>

                    <div>
                      <small>CITY</small>
                      <strong>{student.city}</strong>
                    </div>

                  </div>

                  <div className="email">
                    ✉️ {student.email}
                  </div>

                  <div className="actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editStudent(student)
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteStudent(student.id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      <footer>
        College Student Management System • React + Spring Boot + MongoDB
      </footer>

    </div>
  );
}

export default App;
