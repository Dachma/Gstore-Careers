import { useEffect, useState } from "react";
import { getApplications } from "../services/api";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [sort, setSort] = useState("date_desc");
  const [vacancyFilter, setVacancyFilter] = useState("");
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState('');

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
          sort,
          vacancyId: vacancyFilter || undefined,
          from: from || undefined,
          to: to || undefined,
          search: search || undefined,
        });

        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadApplications();
  }, [sort, vacancyFilter, from, to, search]);

  return (
    <div>
      <h1>Admin Applications</h1>
      <div>
  <label>Search: </label>
  <input
    type="text"
    placeholder="Name or email"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      <div>
        <label>From: </label>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <label style={{ marginLeft: 10 }}>To: </label>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div>
        <label>Sort by: </label>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date_desc">Date (Newest first)</option>
          <option value="date_asc">Date (Oldest first)</option>
          <option value="name_asc">Name (A → Z)</option>
          <option value="name_desc">Name (Z → A)</option>
        </select>
      </div>

      <div>
        <label>Vacancy: </label>

        <select
          value={vacancyFilter}
          onChange={(e) => setVacancyFilter(e.target.value)}
        >
          <option value="">All vacancies</option>
          <option value="frontend-dev">Frontend Developer</option>
          <option value="junior-react">Junior React Developer</option>
          <option value="qa-engineer">QA Engineer</option>
        </select>
      </div>
      <button onClick={handleExportCSV}>Export CSV</button>
      <table>
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
              <td>
                No applications found for the selected filters
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.vacancyId}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/resumes/${app.resumeFile}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
