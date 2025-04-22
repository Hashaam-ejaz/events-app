const pool = require('../config/db');

// Get all artists
exports.getAllArtists = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM artist ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get artist by ID
exports.getArtistById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM artist WHERE artist_id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Artist not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add new artist
exports.createArtist = async (req, res) => {
  const { name, bio, instagram, facebook, twitter, image_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO artist (name, bio, instagram, facebook, twitter, image_url)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING artist_id`,
      [name, bio, instagram, facebook, twitter, image_url]
    );
    res.status(201).json({ artist_id: result.rows[0].artist_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
