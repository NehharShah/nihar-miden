import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

// Serve commitment system files
app.use('/commitment-system', express.static(path.join(__dirname, 'commitment-system')));

// Serve payment splitter files
app.use('/payment-splitter', express.static(path.join(__dirname, 'payment-splitter')));

// Root route - redirect to commitment system
app.get('/', (req, res) => {
    res.redirect('/commitment-system/');
});

// Commitment system home
app.get('/commitment-system', (req, res) => {
    res.sendFile(path.join(__dirname, 'commitment-system', 'index.html'));
});

// Payment splitter home
app.get('/payment-splitter', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment-splitter', 'payment-splitter.html'));
});

app.get('/payment-splitter/', (req, res) => {
    res.sendFile(path.join(__dirname, 'payment-splitter', 'payment-splitter.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Miden Demo Server running at http://localhost:${PORT}`);
    console.log(`📁 Commitment System: http://localhost:${PORT}/commitment-system/`);
    console.log(`💰 Payment Splitter: http://localhost:${PORT}/payment-splitter/`);
}); 