# Miden Privacy Demos

Two privacy-preserving blockchain demonstrations built with Miden's Web SDK.

## Projects

### 1. Privacy-Preserving Deadline Commitment System
**Demo**: http://localhost:3000/commitment-system/

A time-locked commitment system where users can create private commitments that automatically reveal when deadlines pass.

**Features:**
- Create commitments with specific deadlines
- Keep commitment details private until deadlines pass
- Automatic revelation when deadlines expire
- Cryptographic integrity verification

### 2. Privacy-Preserving Payment Splitter
**Demo**: http://localhost:3000/payment-splitter/

A group payment splitting system where individual contribution amounts remain completely private.

**Features:**
- Group payment splitting with individual privacy
- Zero-knowledge verification of split completion
- Real-time progress tracking without revealing amounts
- Trustless coordination without central authority

## Quick Start

```bash
# Install dependencies
npm install

# Start the demo server
npm start

# Open in browser
open http://localhost:3000/commitment-system/ 
open http://localhost:3000/payment-splitter/

```

## Project Structure

```
miden-take-home/
├── commitment-system/
│   ├── SUBMISSION.md     
│   ├── commitment-system-simple.js
│   └── index.html
├── payment-splitter/
│   ├── SUBMISSION.md          
│   ├── payment-splitter.js
│   └── payment-splitter-demo.html
├── server.js
├── package.json
└── README.md
```

## Technical Details

Each project has its own detailed submission document:
- **Commitment System**: See `commitment-system/SUBMISSION.md`
- **Payment Splitter**: See `payment-splitter/SUBMISSION.md`

These documents include:
- Complete technical implementation
- Step-by-step tutorials
- Real-world applications
- SDK feedback and recommendations
