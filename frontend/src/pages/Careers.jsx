import { vacancies } from "../data/vacancies";
import { Link } from "react-router-dom";
import "../styles/Careers.css";

export default function Careers() {
  return (
    <div className="careers-wrapper">
      <div className="careers-page">
        <h1 className="careers-title">Careers at Gstore</h1>
        <p className="careers-subtitle">
          Explore open positions and apply today
        </p>
        <div className="vacancies-grid">
          {vacancies.map((vacancy) => (
            <div key={vacancy.id} className="vacancy-card">
              <h3>{vacancy.title}</h3>
              <p>{vacancy.description}</p>

              <Link to={`/apply/${vacancy.id}`} className="apply-btn">
                <button>Apply</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
