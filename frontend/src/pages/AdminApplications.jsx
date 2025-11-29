import { useEffect, useState } from "react";
import { getApplications } from "../services/api";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [sort, setSort] = useState("date_desc");
  const [vacancyFilter, setVacancyFilter] = useState("");

  function handleExportCSV() {
    if (!applications.length) {
      return;
    }

    const headers = ["Name", "Email", "Phone", "Vacancy", "Date"];

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
        });

        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadApplications();
  }, [sort, vacancyFilter]);

  return (
    <div>
      <h1>Admin Applications</h1>
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
      <button onClick={handleExportCSV}>
  Export CSV
</button>
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
          {applications.map((app) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
