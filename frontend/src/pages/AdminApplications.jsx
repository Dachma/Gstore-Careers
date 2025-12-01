import { useEffect, useState } from "react";
import { getApplications } from "../services/api";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { vacancies } from "../data/vacancies";
import "../styles/Admin.css";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [sort, setSort] = useState("date_desc");
  const [vacancyFilter, setVacancyFilter] = useState("");
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  function handleExportCSV() {
    if (!applications.length) {
      return;
    }

    const headers = ["Name", "Email", "Phone", "Vacancy", "Date", "Resume"];

    const rows = applications.map((app) => [
      app.name,
      app.email,
      app.phone,
      app.vacancyId,
      new Date(app.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "applications.csv");
    link.click();

    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await getApplications({
          page,
          limit,
          sort,
          vacancyId: vacancyFilter || undefined,
          from: from || undefined,
          to: to || undefined,
          search: search || undefined,
        });

        setApplications(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
        });
      } catch (err) {
        console.error(err);
      }
    }

    loadApplications();
  }, [sort, vacancyFilter, from, to, search, page]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Admin Applications</h1>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date_desc">Newest</option>
          <option value="date_asc">Oldest</option>
          <option value="name_asc">Name A–Z</option>
          <option value="name_desc">Name Z–A</option>
        </select>

        <select
          value={vacancyFilter}
          onChange={(e) => setVacancyFilter(e.target.value)}
        >
          <option value="">All vacancies</option>
          {vacancies.map((v) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </select>

        <button className="export-btn" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Vacancy</th>
              <th>Date</th>
              <th>Resume</th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="5">
                  No applications found for the selected filters
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>
                    <span className={`vacancy-badge vacancy-${app.vacancyId}`}>
                      {vacancies.find((v) => v.id === app.vacancyId)?.title ||
                        app.vacancyId}
                    </span>
                  </td>
                  <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td>
                    <a
                      href={`http://localhost:5000/uploads/resumes/${app.resumeFile}`}
                      target="_blank"
                      className="resume-link"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {applications.length > 0 && (
          <div className="pagination">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
