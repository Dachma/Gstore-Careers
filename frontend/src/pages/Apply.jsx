import { useParams } from "react-router-dom";
import { useState } from "react";

export default function Apply() {
  const { vacancyId } = useParams();
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("CV must be a PDF file");
      return;
    }

    setForm((prev) => ({ ...prev, resume: file }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.resume) {
      setError("All fields are required");
      return;
    }

    if (form.resume.type !== "application/pdf") {
      setError("CV must be a PDF file");
      return;
    }

    console.log({ ...form, vacancyId });

    setSuccess(true);
  };

  if (success) {
    return (
      <div>
        <h2>✅ Application submitted successfully</h2>
        <p>Thank you for applying. We’ll contact you soon.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Apply for: {vacancyId}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label>CV (PDF only)</label>
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
