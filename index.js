import users from '../database.json';

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id, search, page = 1, limit = 20 } = req.query;

  // 1. Single user by ID: ?id=100005
  if (id) {
    const user = users.find(u => u.ID === Number(id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  }

  let result = users;

  // 2. Search filter: ?search=delhi
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(u =>
      (u.First_Name && u.First_Name.toLowerCase().includes(q)) ||
      (u.Last_Name && u.Last_Name.toLowerCase().includes(q)) ||
      (u.City && u.City.toLowerCase().includes(q))
    );
  }

  // 3. Pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const start = (pageNum - 1) * limitNum;
  const paginated = result.slice(start, start + limitNum);

  return res.status(200).json({
    totalRecords: result.length,
    currentPage: pageNum,
    totalPages: Math.ceil(result.length / limitNum),
    data: paginated
  });
}
