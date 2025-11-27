import { vacancies } from '../data/vacancies';
import { Link } from 'react-router-dom';

export default function Careers() {
  return (
    <div>
      <h1>Careers at Gstore</h1>

      {vacancies.map(vacancy => (
        <div key={vacancy.id}>
          <h3>{vacancy.title}</h3>
          <p>{vacancy.description}</p>

          <Link to={`/apply/${vacancy.id}`}>
            <button>Apply</button>
          </Link>
        </div>
      ))}
    </div>
  );
}