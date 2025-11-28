import { useParams } from "react-router-dom";
import { useState } from "react";

export default function Apply() {
  const { vacancyId } = useParams();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setStatus({ loading: true, error: '', success: '' });

    if (!form.name || !form.email || !form.phone || !form.resume) {
      setError("All fields are required");
      return;
    }

    if (form.resume.type !== "application/pdf") {
      setStatus({ loading: false, error: 'Only PDF files are allowed', success: '' });
      return;
    }

    try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('vacancyId', vacancyId); // from route param
    formData.append('resume', form.resume);   // MUST match upload.single('resume')

    const res = await fetch('http://localhost:5000/apply', {
      method: 'POST',
      body: formData, // ❗ no headers here
    });

    const data = await res.json();
    console.log(data)
    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    setStatus({
      loading: false,
      error: '',
      success: 'Application submitted successfully!',
    });

    // optional: clear form
    setForm({ name: '', email: '', phone: '', resume: null });
  } catch (err) {
    setStatus({
      loading: false,
      error: err.message,
      success: '',
    });
  }


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
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
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
            required
          />
        </div>

        <button type="submit" disabled={status.loading}>
          {status.loading ? "Submitting…" : "Submit"}
        </button>
        {status.error && <p style={{ color: "red" }}>{status.error}</p>}
        {status.success && <p style={{ color: "green" }}>{status.success}</p>}
      </form>
    </div>
  );
}
