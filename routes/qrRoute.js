const express = require('express');
const qrController = require('../controllers/qrController');

const router = express.Router();

router.post('/getqrhere', qrController.getQrHere);
router.post('/getqrinemail', qrController.getQrInEmail);



module.exports = router;