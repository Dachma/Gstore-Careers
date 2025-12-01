import { useParams } from "react-router-dom";
import { useState } from "react";
import { vacancies } from "../data/vacancies";
import { Link } from "react-router-dom";
import "../styles/Apply.css";

export default function Apply() {
  const { vacancyId } = useParams();
  const [isDragging, setIsDragging] = useState(false);
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
      setStatus({
        loading: false,
        error: "CV must be a PDF file",
        success: "",
      });
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

    setStatus({ loading: true, error: "", success: "" });

    if (!form.name || !form.email || !form.phone || !form.resume) {
      setStatus({
        loading: false,
        error: "All fields are required",
        success: "",
      });
      return;
    }

    if (form.resume.type !== "application/pdf") {
      setStatus({
        loading: false,
        error: "Only PDF files are allowed",
        success: "",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("vacancyId", vacancyId);
      formData.append("resume", form.resume);

      const res = await fetch("http://localhost:5000/apply", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setStatus({
        loading: false,
        error: "",
        success: "Application submitted successfully!",
      });

      setForm({ name: "", email: "", phone: "", resume: null });
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message,
        success: "",
      });
    }
  };

  const vacancy = vacancies.find((v) => v.id === vacancyId);

  return (
    <div className="apply-page">
      <div className="apply-card">
        <h1 className="apply-title">
          Apply for: {vacancy?.title || vacancyId}
        </h1>
        <form
          className={`apply-form ${status.success ? "success" : ""}`}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div
            className={`upload-box ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              document.querySelector('input[name="resume"]').click()
            }
          >
            <label className="file-name">
              {form.resume
                ? form.resume.name
                : "Drag & drop or click to upload"}
            </label>

            <input
              type="file"
              name="resume"
              accept="application/pdf"
              onChange={handleChange}
              hidden
            />
          </div>

          <button
            className="submit-btn"
            type="submit"
            disabled={status.loading || status.success}
          >
            {status.loading
              ? "Submitting…"
              : status.success
              ? "Submitted"
              : "Submit"}
          </button>
          {status.error && <p className="error-text">{status.error}</p>}
          {status.success && (
            <div className="success-card">
              <div className="success-icon">✅</div>
              <h2>Application submitted</h2>
              <p>
                Thank you for applying. Our team will review your application
                and contact you if there’s a match.
              </p>
            </div>
          )}
        </form>
        <div className="back-link-wrap">
          <Link to="/" className="back-link">
            Back to Careers
          </Link>
        </div>
      </div>
    </div>
  );
}
