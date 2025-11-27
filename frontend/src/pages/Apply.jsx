import { useParams } from 'react-router-dom'

export default function Apply() {
  const { vacancyId } = useParams()
    console.log(vacancyId)
  return (
    <div>
      <h1>Apply for: {vacancyId}</h1>

      <form>
        <div>
          <label>Name</label>
          <input type="text" />
        </div>

        <div>
          <label>Email</label>
          <input type="email" />
        </div>

        <div>
          <label>Phone</label>
          <input type="tel" />
        </div>

        <div>
          <label>CV (PDF only)</label>
          <input type="file" accept="application/pdf" />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}