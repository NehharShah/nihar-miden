class SimpleCommitmentSystem {
    constructor() {
        this.commitments = new Map();
        this.initialized = false;
    }

    async initialize() {
        console.log("🔧 Initializing Simple Commitment System...");
        
        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.initialized = true;
        console.log("✅ System initialized successfully!");
    }

    async createCommitment(commitmentText, deadlineTimestamp, stakeAmount = 100n) {
        if (!this.initialized) {
            throw new Error("System not initialized");
        }

        console.log("🔐 Creating private commitment...");
        
        const commitmentHash = this.hashCommitment(commitmentText, deadlineTimestamp);
        const commitmentId = this.generateCommitmentId();
        
        const commitment = {
            id: commitmentId,
            text: commitmentText,
            deadline: deadlineTimestamp,
            stake: stakeAmount,
            hash: commitmentHash,
            created: Date.now(),
            status: 'active',
            revealed: false
        };
        
        this.commitments.set(commitmentId, commitment);
        
        console.log(`✅ Commitment created: ${commitmentId}`);
        console.log(`🔒 Hash: ${commitmentHash}`);
        console.log(`⏰ Deadline: ${new Date(deadlineTimestamp).toISOString()}`);
        
        return commitmentId;
    }

    async revealCommitment(commitmentId) {
        console.log(`🔓 Attempting to reveal: ${commitmentId}`);
        
        const commitment = this.commitments.get(commitmentId);
        if (!commitment) {
            throw new Error("Commitment not found");
        }
        
        const currentTime = Date.now();
        if (currentTime < commitment.deadline) {
            throw new Error(`Cannot reveal until deadline: ${new Date(commitment.deadline).toISOString()}`);
        }
        
        if (commitment.revealed) {
            console.log("ℹ️ Commitment already revealed");
            return commitment;
        }
        
        // Verify integrity
        const verificationHash = this.hashCommitment(commitment.text, commitment.deadline);
        if (verificationHash !== commitment.hash) {
            throw new Error("Commitment integrity verification failed");
        }
        
        commitment.revealed = true;
        commitment.revealedAt = currentTime;
        
        console.log("✅ Commitment revealed successfully!");
        console.log(`📝 Commitment: "${commitment.text}"`);
        console.log(`💰 Stake: ${commitment.stake} units`);
        
        return commitment;
    }

    getCommitmentStatus(commitmentId) {
        const commitment = this.commitments.get(commitmentId);
        if (!commitment) {
            throw new Error("Commitment not found");
        }
        
        const currentTime = Date.now();
        const timeUntilDeadline = commitment.deadline - currentTime;
        
        return {
            id: commitmentId,
            text: commitment.text,
            status: commitment.status,
            revealed: commitment.revealed,
            deadline: new Date(commitment.deadline).toISOString(),
            timeUntilDeadline: Math.max(0, timeUntilDeadline),
            canReveal: currentTime >= commitment.deadline,
            hash: commitment.hash,
            stake: commitment.stake,
            created: commitment.created,
            revealedAt: commitment.revealedAt
        };
    }

    listCommitments() {
        return Array.from(this.commitments.keys()).map(id => this.getCommitmentStatus(id));
    }

    hashCommitment(text, deadline) {
        const combined = text + deadline.toString();
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    generateCommitmentId() {
        return 'commit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async cleanup() {
        console.log("🧹 Cleaning up system...");
        this.commitments.clear();
    }
}

// Export for use in other files (both Node.js and browser)
if (typeof window !== 'undefined') {
    window.SimpleCommitmentSystem = SimpleCommitmentSystem;
}

// ES Module export
export { SimpleCommitmentSystem }; 