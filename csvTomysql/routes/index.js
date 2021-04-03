const express = require('express');
const router = express.Router();
const clinicRouter = require('./clinic.router');

router.use('/clinics', clinicRouter);

module.exports = router;