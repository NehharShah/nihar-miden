export class PrivacyPaymentSplitter {
    constructor() {
        this.splits = new Map();
        this.participants = new Map(); 
        this.initialized = false;
    }

    async initialize() {
        console.log("🔧 Initializing Privacy Payment Splitter...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.initialized = true;
        console.log("✅ System initialized successfully!");
    }

    /**
     * Create a new payment split
     * @param {string} description - What the payment is for
     * @param {number} totalAmount - Total amount to split (in cents)
     * @param {Array} participantIds - Array of participant IDs
     * @param {string} splitType - 'equal' or 'custom'
     * @returns {string} - Split ID
     */
    async createSplit(description, totalAmount, participantIds, splitType = 'equal') {
        if (!this.initialized) {
            throw new Error("System not initialized");
        }

        console.log("💰 Creating payment split...");
        
        const splitId = this.generateSplitId();
        const customAmounts = splitType === 'equal' 
            ? this.calculateEqualSplit(totalAmount, participantIds.length)
            : null;

        const split = {
            id: splitId,
            description,
            totalAmount,
            participantIds: [...participantIds],
            splitType,
            customAmounts,
            contributions: new Map(),
            created: Date.now(),
            status: 'pending',
            completedAt: null
        };

        this.splits.set(splitId, split);

        // Initialize participants if they don't exist
        participantIds.forEach(participantId => {
            if (!this.participants.has(participantId)) {
                this.participants.set(participantId, {
                    id: participantId,
                    name: `User ${participantId}`,
                    totalContributions: 0,
                    splitHistory: []
                });
            }
        });

        console.log(`✅ Split created: ${splitId}`);
        console.log(`📝 Description: "${description}"`);
        console.log(`💵 Total: $${(totalAmount / 100).toFixed(2)}`);
        console.log(`👥 Participants: ${participantIds.length}`);

        return splitId;
    }

    /**
     * Add a private contribution to a split
     * @param {string} splitId - The split ID
     * @param {string} participantId - Who is contributing
     * @param {number} amount - Amount in cents
     * @returns {Promise<Object>} - Contribution receipt
     */
    async addContribution(splitId, participantId, amount) {
        console.log(`💳 Processing contribution from ${participantId}...`);

        const split = this.splits.get(splitId);
        if (!split) {
            throw new Error("Split not found");
        }

        if (!split.participantIds.includes(participantId)) {
            throw new Error("Participant not part of this split");
        }

        if (split.status === 'completed') {
            throw new Error("Split already completed");
        }

        // Generate privacy-preserving commitment
        const contributionHash = this.hashContribution(splitId, participantId, amount);
        
        const contribution = {
            participantId,
            amount,
            hash: contributionHash,
            timestamp: Date.now(),
            verified: true
        };

        split.contributions.set(participantId, contribution);

        // Update participant's total (this would be private in real implementation)
        const participant = this.participants.get(participantId);
        participant.totalContributions += amount;

        console.log(`✅ Contribution recorded for ${participantId}`);
        console.log(`🔒 Commitment hash: ${contributionHash}`);

        // Check if split is complete
        await this.checkSplitCompletion(splitId);

        return {
            contributionId: `${splitId}_${participantId}`,
            hash: contributionHash,
            timestamp: contribution.timestamp
        };
    }

    /**
     * Get split status without revealing individual contributions
     * @param {string} splitId - The split ID
     * @returns {Object} - Public split information
     */
    getSplitStatus(splitId) {
        const split = this.splits.get(splitId);
        if (!split) {
            throw new Error("Split not found");
        }

        const totalContributed = Array.from(split.contributions.values())
            .reduce((sum, contrib) => sum + contrib.amount, 0);
        
        const remainingAmount = split.totalAmount - totalContributed;
        const contributionCount = split.contributions.size;
        const expectedContributions = split.participantIds.length;

        return {
            id: splitId,
            description: split.description,
            totalAmount: split.totalAmount,
            totalContributed,
            remainingAmount,
            contributionCount,
            expectedContributions,
            status: split.status,
            isComplete: split.status === 'completed',
            participants: split.participantIds.map(id => ({
                id,
                hasContributed: split.contributions.has(id),
                // Individual amounts remain private
            }))
        };
    }

    /**
     * Get participant's private view (only their own data)
     * @param {string} participantId - The participant ID
     * @param {string} splitId - The split ID
     * @returns {Object} - Participant's private information
     */
    getParticipantView(participantId, splitId) {
        const split = this.splits.get(splitId);
        if (!split) {
            throw new Error("Split not found");
        }

        if (!split.participantIds.includes(participantId)) {
            throw new Error("Access denied: not a participant");
        }

        const contribution = split.contributions.get(participantId);
        const expectedAmount = split.splitType === 'equal' 
            ? split.customAmounts 
            : null;

        return {
            splitId,
            description: split.description,
            totalAmount: split.totalAmount,
            yourExpectedAmount: expectedAmount,
            yourContribution: contribution ? contribution.amount : 0,
            hasContributed: !!contribution,
            contributionHash: contribution ? contribution.hash : null,
            otherParticipants: split.participantIds
                .filter(id => id !== participantId)
                .map(id => ({
                    id,
                    hasContributed: split.contributions.has(id)
                    // Their amounts remain private
                }))
        };
    }

    /**
     * Verify a split's integrity using zero-knowledge proof concepts
     * @param {string} splitId - The split ID
     * @returns {Object} - Verification result
     */
    async verifySplitIntegrity(splitId) {
        console.log(`🔍 Verifying split integrity: ${splitId}`);

        const split = this.splits.get(splitId);
        if (!split) {
            throw new Error("Split not found");
        }

        // Simulate zero-knowledge verification
        await new Promise(resolve => setTimeout(resolve, 1500));

        const verifications = [];
        
        // Verify each contribution hash
        for (const [participantId, contribution] of split.contributions) {
            const expectedHash = this.hashContribution(
                splitId, 
                participantId, 
                contribution.amount
            );
            
            const isValid = expectedHash === contribution.hash;
            verifications.push({
                participantId,
                hashValid: isValid,
                // Amount remains private in verification
            });
        }

        const totalContributed = Array.from(split.contributions.values())
            .reduce((sum, contrib) => sum + contrib.amount, 0);

        const isComplete = totalContributed === split.totalAmount;
        const allHashesValid = verifications.every(v => v.hashValid);

        console.log(`✅ Verification complete`);
        console.log(`🔐 All hashes valid: ${allHashesValid}`);
        console.log(`💯 Split complete: ${isComplete}`);

        return {
            splitId,
            isValid: allHashesValid && isComplete,
            totalMatches: isComplete,
            hashesValid: allHashesValid,
            verificationCount: verifications.length,
            // Individual details remain private
        };
    }

    /**
     * List all splits for a participant
     * @param {string} participantId - The participant ID
     * @returns {Array} - List of splits
     */
    getParticipantSplits(participantId) {
        const participantSplits = [];
        
        for (const [splitId, split] of this.splits) {
            if (split.participantIds.includes(participantId)) {
                const contribution = split.contributions.get(participantId);
                participantSplits.push({
                    id: splitId,
                    description: split.description,
                    totalAmount: split.totalAmount,
                    status: split.status,
                    yourContribution: contribution ? contribution.amount : 0,
                    hasContributed: !!contribution,
                    created: split.created
                });
            }
        }

        return participantSplits.sort((a, b) => b.created - a.created);
    }

    // Private helper methods

    calculateEqualSplit(totalAmount, participantCount) {
        const baseAmount = Math.floor(totalAmount / participantCount);
        const remainder = totalAmount % participantCount;
        
        // First participant gets any remainder
        return baseAmount + (remainder > 0 ? remainder : 0);
    }

    async checkSplitCompletion(splitId) {
        const split = this.splits.get(splitId);
        const totalContributed = Array.from(split.contributions.values())
            .reduce((sum, contrib) => sum + contrib.amount, 0);

        if (totalContributed >= split.totalAmount && 
            split.contributions.size === split.participantIds.length) {
            
            split.status = 'completed';
            split.completedAt = Date.now();
            
            console.log(`🎉 Split completed: ${splitId}`);
            
            // Update participant histories
            split.participantIds.forEach(participantId => {
                const participant = this.participants.get(participantId);
                participant.splitHistory.push({
                    splitId,
                    description: split.description,
                    completedAt: split.completedAt
                });
            });
        }
    }

    hashContribution(splitId, participantId, amount) {
        // Use deterministic hash for demo purposes
        const combined = `${splitId}_${participantId}_${amount}`;
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }

    generateSplitId() {
        return 'split_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async cleanup() {
        console.log("🧹 Cleaning up payment splitter...");
        this.splits.clear();
        this.participants.clear();
    }
}

// Demo function
export async function demonstratePaymentSplitter() {
    const splitter = new PrivacyPaymentSplitter();
    
    try {
        await splitter.initialize();
        
        // Create a dinner split
        const splitId = await splitter.createSplit(
            "Team dinner at fancy restaurant",
            12000, // $120.00
            ['alice', 'bob', 'charlie', 'diana'],
            'equal'
        );
        
        console.log("\n📊 Initial split status:");
        console.log(splitter.getSplitStatus(splitId));
        
        // Add contributions over time
        await splitter.addContribution(splitId, 'alice', 3000); // $30
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await splitter.addContribution(splitId, 'bob', 3000); // $30
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await splitter.addContribution(splitId, 'charlie', 3000); // $30
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("\n📊 Status before final contribution:");
        console.log(splitter.getSplitStatus(splitId));
        
        await splitter.addContribution(splitId, 'diana', 3000); // $30
        
        console.log("\n📊 Final status:");
        console.log(splitter.getSplitStatus(splitId));
        
        // Verify integrity
        console.log("\n🔍 Verifying split integrity:");
        await splitter.verifySplitIntegrity(splitId);
        
    } catch (error) {
        console.error("❌ Demo failed:", error);
    } finally {
        await splitter.cleanup();
    }
}

// Export for demo
if (typeof window !== 'undefined') {
    window.PrivacyPaymentSplitter = PrivacyPaymentSplitter;
    window.demonstratePaymentSplitter = demonstratePaymentSplitter;
} 