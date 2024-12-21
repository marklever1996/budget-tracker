import { jStat } from 'jstat'; // Voor statistische berekeningen

export class MonteCarloService {
    static async runSimulation({
        initialAmount,
        monthlyContribution,
        yearsToRetirement,
        withdrawalRate,
        portfolioAllocation,
        returns,
        volatility,
        iterations = 10000
    }) {
        const monthlyData = [];
        const finalBalances = [];
        
        // Loop door alle iteraties
        for (let i = 0; i < iterations; i++) {
            const monthlyBalances = [initialAmount];
            let currentBalance = initialAmount;

            // Simuleer maandelijkse veranderingen
            for (let month = 1; month <= yearsToRetirement * 12; month++) {
                // Genereer random returns volgens normale verdeling
                const stockReturn = jStat.normal.sample(
                    returns.stocks / 12,
                    volatility.stocks / Math.sqrt(12)
                );
                const bondReturn = jStat.normal.sample(
                    returns.bonds / 12,
                    volatility.bonds / Math.sqrt(12)
                );

                // Bereken gewogen rendement
                const monthlyReturn = 
                    (stockReturn * portfolioAllocation.stocks) +
                    (bondReturn * portfolioAllocation.bonds);

                // Update balans
                currentBalance = currentBalance * (1 + monthlyReturn) + monthlyContribution;
                monthlyBalances.push(currentBalance);
            }

            monthlyData.push(monthlyBalances);
            finalBalances.push(currentBalance);
        }

        // Bereken statistieken
        const successRate = this.calculateSuccessRate(finalBalances, withdrawalRate);
        const percentiles = this.calculatePercentiles(finalBalances);
        const monthlyPercentiles = this.calculateMonthlyPercentiles(monthlyData);

        return {
            successRate,
            medianEndingBalance: percentiles.median,
            worstCaseBalance: percentiles.worst,
            bestCaseBalance: percentiles.best,
            monthlyPercentiles,
            allSimulations: monthlyData
        };
    }

    static calculateSuccessRate(balances, withdrawalRate) {
        const targetAmount = Math.max(...balances) * withdrawalRate;
        const successfulSimulations = balances.filter(balance => 
            balance >= targetAmount
        ).length;
        return (successfulSimulations / balances.length) * 100;
    }

    static calculatePercentiles(balances) {
        const sorted = [...balances].sort((a, b) => a - b);
        return {
            worst: sorted[0],
            percentile10: sorted[Math.floor(sorted.length * 0.1)],
            median: sorted[Math.floor(sorted.length * 0.5)],
            percentile90: sorted[Math.floor(sorted.length * 0.9)],
            best: sorted[sorted.length - 1]
        };
    }

    static calculateMonthlyPercentiles(monthlyData) {
        const numMonths = monthlyData[0].length;
        const monthlyPercentiles = [];

        for (let month = 0; month < numMonths; month++) {
            const monthValues = monthlyData.map(sim => sim[month]);
            monthlyPercentiles.push(this.calculatePercentiles(monthValues));
        }

        return monthlyPercentiles;
    }
}

export const monteCarloSimulation = (params) => MonteCarloService.runSimulation(params); 