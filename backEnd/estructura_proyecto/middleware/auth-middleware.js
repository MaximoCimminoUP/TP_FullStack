const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, 'your-secret-key');
 req.userId = decoded.userId;
 next();
 } catch (error) {
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;

// Protected route
router.get('/', verifyToken, (req, res) => {
res.status(200).json({ message: 'Protected route accessed' });
});

module.exports = router;