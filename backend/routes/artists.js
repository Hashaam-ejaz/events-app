const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');

router.get('/', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);
router.post('/', artistController.createArtist); // TODO: protect this route

module.exports = router;
