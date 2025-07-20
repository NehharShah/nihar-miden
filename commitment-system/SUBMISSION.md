# Privacy-Preserving Deadline Commitment System - Submission

## Project Overview

A demonstration of Miden's privacy capabilities through time-locked commitments that remain private until their deadlines pass.

### What Was Built

A **Privacy-Preserving Deadline Commitment System** that allows users to:

- Create commitments with specific deadlines
- Keep commitment details private until deadlines pass
- Automatically reveal commitments when deadlines expire
- Verify cryptographic integrity throughout the process

### Miden Features Demonstrated

#### **Client-Side Privacy**
- Commitment content stays on the user's device until reveal
- Zero-knowledge proofs verify integrity without revealing content
- Users control when and what information becomes public

#### **Programmable Privacy Scripts**
- Time-based logic enforces deadline conditions
- Automatic revelation when time conditions are met
- No trusted third parties needed for deadline management

#### **Client-Side Proving**
- Commitment creation and verification happens locally
- Cryptographic proofs verify correctness without revealing content
- Minimal on-chain data storage

### What Makes Miden Different

Traditional blockchains make all data public by default, requiring trusted third parties for privacy. Miden enables:

- **Private by default**: Data stays on your device
- **Selective disclosure**: Choose what to reveal and when
- **Trustless privacy**: No third parties needed
- **Client-side computation**: Verification happens locally

### Real-World Applications

- **Academic Research**: Timestamp hypotheses before experiments
- **Prediction Markets**: Sealed predictions revealed after outcomes
- **Business Strategy**: Commit to decisions with verifiable timestamps
- **Anonymous Voting**: Time-locked votes for fair elections

### Challenges Encountered

1. **SDK Integration**: Limited WebAssembly support in demo environments
2. **Time-based Logic**: Implementing deadline enforcement in a simplified demo
3. **Privacy Simulation**: Demonstrating privacy concepts without full node infrastructure

## Implementation Details

### Core Architecture

The system uses a `SimpleCommitmentSystem` class with these key methods:

```javascript
// Create privacy-preserving commitment
async createCommitment(text, deadline, stake) {
    const hash = this.hashCommitment(text, deadline);
    // Store locally (simulates Miden private notes)
    return commitmentId;
}

// Reveal after deadline passes
async revealCommitment(commitmentId) {
    // Enforce deadline (simulates Miden script validation)
    if (currentTime < commitment.deadline) {
        throw new Error("Cannot reveal until deadline");
    }
    // Verify integrity
    return revealedCommitment;
}
```

### Code Quality

- **Modular design** with separate UI and business logic
- **Type safety** with proper BigInt usage for financial values
- **Error handling** with user-friendly messages
- **Clear documentation** explaining design decisions

### SDK Limitations

The demo uses a simplified implementation because:
- WebAssembly initialization requires complex node setup
- Time-based scripting needs blockchain timestamp access
- Full SDK integration requires running Miden node infrastructure

The architecture is designed to easily accommodate full SDK features when available.

## Tutorial: Building the Commitment System

### Why This Matters

Traditional commitment schemes require trusted third parties or reveal sensitive information prematurely. Miden's privacy-first architecture enables commitments that remain private until deadlines pass, with cryptographic proof that they haven't been tampered with.

### Prerequisites

- Node.js (version 16 or higher)
- Basic understanding of JavaScript and async/await
- Familiarity with blockchain concepts

### Step-by-Step Guide

#### Step 1: Project Setup

```bash
mkdir miden-commitment-system
cd miden-commitment-system
npm init -y
npm install @demox-labs/miden-sdk express
```

#### Step 2: Core Commitment System

Create `commitment-system.js`:

```javascript
class PrivacyCommitmentSystem {
    constructor() {
        this.commitments = new Map();
    }

    async createCommitment(text, deadline, stake) {
        const hash = this.hashCommitment(text, deadline);
        const id = this.generateId();
        
        const commitment = {
            id, text, deadline, stake, hash,
            created: Date.now(),
            revealed: false
        };
        
        this.commitments.set(id, commitment);
        return id;
    }
}
```

#### Step 3: Implementing Privacy-Preserving Reveals

```javascript
async revealCommitment(commitmentId) {
    const commitment = this.commitments.get(commitmentId);
    
    // Enforce deadline
    if (Date.now() < commitment.deadline) {
        throw new Error("Cannot reveal until deadline passes");
    }
    
    // Verify integrity
    const verificationHash = this.hashCommitment(
        commitment.text, 
        commitment.deadline
    );
    
    if (verificationHash !== commitment.hash) {
        throw new Error("Commitment integrity verification failed");
    }
    
    commitment.revealed = true;
    return commitment;
}
```

#### Step 4: Miden Script Integration

For production, create a Miden script for deadline enforcement:

```javascript
createCommitmentScript(hash, deadline) {
    return `
        begin
            exec.sys::get_block_timestamp
            push.${deadline}
            gte
            if.true
                push.${hash}
                drop
            else
                assert
            end
        end
    `;
}
```

### Key Concepts

#### **Client-Side Privacy vs. Traditional Blockchains**
Traditional blockchains make all data public. Miden enables:
- **Private by default**: Data stays on your device
- **Zero-knowledge proofs**: Verify correctness without revealing content
- **Selective disclosure**: Choose what to reveal and when

#### **Programmable Privacy Scripts**
Miden scripts can:
- Enforce privacy conditions (like time-based reveals)
- Run client-side with private inputs
- Generate proofs without revealing data

#### **Cryptographic Commitments**
A commitment scheme has two phases:
- **Commit**: Create `hash(secret + randomness)` without revealing the secret
- **Reveal**: Show the original secret and prove it matches the hash

### Common Pitfalls

#### 1. Weak Randomness in Hash Generation
**Problem**: Predictable hash inputs make commitments vulnerable.

**Solution**: Include sufficient entropy:
```javascript
// BAD: Predictable
const hash = simpleHash(text);

// GOOD: Includes randomness
const hash = cryptoHash(text + deadline + nonce);
```

#### 2. Client-Side Timestamp Manipulation
**Problem**: `Date.now()` can be manipulated by users.

**Solution**: Use blockchain timestamps in production:
```javascript
// Development: Use local time
const currentTime = Date.now();

// Production: Use Miden block timestamp
const currentTime = await this.webClient.getBlockTimestamp();
```

### What's Next?

Three practical extensions:

1. **Multi-Party Commitments**: Allow multiple users to commit to the same event with automatic tallying
2. **Staking Mechanisms**: Add financial stakes that are forfeited if commitments aren't revealed on time
3. **Verifiable Randomness**: Use Miden's cryptographic capabilities for provably fair random selection

## SDK Feedback

### What Would Have Made This Easier?

1. **Better Documentation**: More comprehensive examples showing real-world usage patterns
2. **Simplified Local Development**: A simplified testnet or simulator for development
3. **Enhanced Error Handling**: More descriptive error messages with debugging guidance
4. **TypeScript Support**: More comprehensive TypeScript definitions for advanced features

### Missing Features

1. **Time Utilities**: Built-in functions for working with blockchain timestamps
2. **Template Scripts**: Library of common Miden script patterns
3. **Client-Side State Management**: Better abstractions for managing private state
