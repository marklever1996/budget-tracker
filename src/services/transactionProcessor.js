// Connectie met de Salt Edge API

class TransactionProcessor {
    categorizeTransaction(transaction) {
        // Categoriseer op basis van description/merchant
        const rules = {
            // Boodschappen
            'ALBERT HEIJN': 'Boodschappen',
            'JUMBO': 'Boodschappen',
            'LIDL': 'Boodschappen',
            'ALDI': 'Boodschappen',
            
            // Transport
            'NS': 'Transport',
            'SHELL': 'Transport',
            'BP': 'Transport',
            'OV-CHIPKAART': 'Transport',
            
            // Entertainment
            'NETFLIX': 'Entertainment',
            'SPOTIFY': 'Entertainment',
            'PATHÉ': 'Entertainment',
            'STEAM': 'Entertainment',
            
            // Utilities
            'VATTENFALL': 'Utilities',
            'ENECO': 'Utilities',
            'VITENS': 'Utilities',
            'KPN': 'Utilities',
            'ZIGGO': 'Utilities',
            
            // Huisvesting
            'HUUR': 'Huisvesting',
            'HYPOTHEEK': 'Huisvesting',
            'VVE': 'Huisvesting',
            
            // Sparen
            'SPAARREKENING': 'Sparen',
            'BELEGGEN': 'Sparen'
        };

        for (const [keyword, category] of Object.entries(rules)) {
            if (transaction.description.toUpperCase().includes(keyword)) {
                return category;
            }
        }

        return 'Overig';
    }

    processTransactions(transactions) {
        const categorizedSpending = {
            'Huisvesting': 0,
            'Boodschappen': 0,
            'Transport': 0,
            'Utilities': 0,
            'Entertainment': 0,
            'Sparen': 0,
            'Overig': 0
        };

        transactions.forEach(transaction => {
            const category = this.categorizeTransaction(transaction);
            categorizedSpending[category] += Math.abs(transaction.amount);
        });

        return categorizedSpending;
    }
}

// Exporteer een instantie van de processor
export const transactionProcessor = new TransactionProcessor(); 