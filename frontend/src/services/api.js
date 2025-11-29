const API_BASE = 'http://localhost:5000';

export async function getApplications(params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== ''
    )
  );

  const query = new URLSearchParams(cleanParams).toString();
  const url = query
    ? `${API_BASE}/applications?${query}`
    : `${API_BASE}/applications`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch applications');

  return res.json();
}