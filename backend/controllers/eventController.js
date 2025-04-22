const pool = require('../config/db');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM event ORDER BY event_date ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specific event (optionally with artist info)
exports.getEventById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Get event details
      const eventResult = await pool.query('SELECT * FROM event WHERE event_id = $1', [id]);
      if (!eventResult.rows.length) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      const event = eventResult.rows[0];
  
      // Get associated artists
      const artistResult = await pool.query(
        `SELECT a.artist_id, a.name, a.bio, a.instagram, a.facebook, a.twitter, a.image_url
         FROM artist a
         JOIN event_artist ea ON ea.artist_id = a.artist_id
         WHERE ea.event_id = $1`,
        [id]
      );
  
      res.json({
        ...event,
        artists: artistResult.rows
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  

// Create new event
exports.createEvent = async (req, res) => {
  const {
    name, category, description, event_date, start_time, end_time,
    ticket_type, ticket_price, ticket_quantity, capacity, image_url, artist_ids
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO event (
        name, category, description, event_date, start_time, end_time,
        ticket_type, ticket_price, ticket_quantity, capacity, image_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING event_id`,
      [name, category, description, event_date, start_time, end_time,
        ticket_type, ticket_price, ticket_quantity, capacity, image_url]
    );

    const eventId = result.rows[0].event_id;

    if (artist_ids && artist_ids.length) {
      const insertPromises = artist_ids.map(artistId =>
        pool.query(
          'INSERT INTO event_artist (event_id, artist_id) VALUES ($1, $2)',
          [eventId, artistId]
        )
      );
      await Promise.all(insertPromises);
    }

    res.status(201).json({ event_id: eventId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
