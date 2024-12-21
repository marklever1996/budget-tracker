import { monteCarloSimulation } from './monteCarloService';

class FireCalculationService {
    // Constanten gebaseerd op historische Nederlandse data
    static MARKET_SCENARIOS = {
        CONSERVATIVE: {
            BONDS_ALLOCATION: 0.70,
            STOCKS_ALLOCATION: 0.30,
            EXPECTED_BONDS_RETURN: 0.02,  // 2% (Nederlandse staatsobligaties historisch)
            EXPECTED_STOCKS_RETURN: 0.07,  // 7% (AEX historisch)
            VOLATILITY_BONDS: 0.05,
            VOLATILITY_STOCKS: 0.15
        },
        MODERATE: {
            BONDS_ALLOCATION: 0.50,
            STOCKS_ALLOCATION: 0.50,
            EXPECTED_BONDS_RETURN: 0.02,
            EXPECTED_STOCKS_RETURN: 0.07,
            VOLATILITY_BONDS: 0.05,
            VOLATILITY_STOCKS: 0.15
        },
        AGGRESSIVE: {
            BONDS_ALLOCATION: 0.30,
            STOCKS_ALLOCATION: 0.70,
            EXPECTED_BONDS_RETURN: 0.02,
            EXPECTED_STOCKS_RETURN: 0.07,
            VOLATILITY_BONDS: 0.05,
            VOLATILITY_STOCKS: 0.15
        }
    };

    // Nederlandse belastingschijven 2024
    static TAX_BRACKETS = {
        BOX_1: [
            { threshold: 75000, rate: 0.3697 },
            { threshold: Infinity, rate: 0.495 }
        ],
        BOX_3: {
            THRESHOLD_1: 57000,
            THRESHOLD_2: 971001,
            RATES: {
                SAVINGS: 0.36/100,
                OTHER_ASSETS: 5.69/100
            },
            TAX_RATE: 0.32
        }
    };

    // AOW berekeningen
    calculateAOW(birthYear, targetAge) {
        const baseAOW = 17000; // Basis AOW bedrag 2024
        const aowAge = this.getAOWAge(birthYear);
        return {
            eligibleAge: aowAge,
            yearlyAmount: targetAge >= aowAge ? baseAOW : 0
        };
    }

    getAOWAge(birthYear) {
        // AOW leeftijd stijgt volgens vastgesteld schema
        if (birthYear <= 1957) return 67;
        if (birthYear <= 1961) return 67 + 3/12;
        return 67 + 6/12;
    }

    // Box 3 belasting berekening
    calculateBox3Tax(totalAssets, mortgageDebt) {
        const netWealth = totalAssets - mortgageDebt;
        if (netWealth <= FireCalculationService.TAX_BRACKETS.BOX_3.THRESHOLD_1) {
            return 0;
        }

        let taxableAmount = 0;
        if (netWealth <= FireCalculationService.TAX_BRACKETS.BOX_3.THRESHOLD_2) {
            taxableAmount = (netWealth * FireCalculationService.TAX_BRACKETS.BOX_3.RATES.OTHER_ASSETS);
        } else {
            // Progressieve berekening voor vermogen boven threshold 2
            const baseAmount = FireCalculationService.TAX_BRACKETS.BOX_3.THRESHOLD_2 * 
                             FireCalculationService.TAX_BRACKETS.BOX_3.RATES.OTHER_ASSETS;
            const excessAmount = (netWealth - FireCalculationService.TAX_BRACKETS.BOX_3.THRESHOLD_2) * 
                               (FireCalculationService.TAX_BRACKETS.BOX_3.RATES.OTHER_ASSETS * 1.2);
            taxableAmount = baseAmount + excessAmount;
        }

        return taxableAmount * FireCalculationService.TAX_BRACKETS.BOX_3.TAX_RATE;
    }

    // Monte Carlo simulatie voor verschillende scenario's
    async calculateSuccessRate(inputs) {
        const scenario = FireCalculationService.MARKET_SCENARIOS[inputs.investmentStrategy.toUpperCase()];
        const simulationResults = await monteCarloSimulation({
            initialAmount: inputs.currentSavings,
            monthlyContribution: inputs.monthlyInvestment,
            yearsToRetirement: inputs.targetAge - inputs.currentAge,
            withdrawalRate: inputs.safeWithdrawalRate / 100,
            portfolioAllocation: {
                stocks: scenario.STOCKS_ALLOCATION,
                bonds: scenario.BONDS_ALLOCATION
            },
            returns: {
                stocks: scenario.EXPECTED_STOCKS_RETURN,
                bonds: scenario.EXPECTED_BONDS_RETURN
            },
            volatility: {
                stocks: scenario.VOLATILITY_STOCKS,
                bonds: scenario.VOLATILITY_BONDS
            },
            iterations: 10000
        });

        return {
            successRate: simulationResults.successRate,
            medianEndingBalance: simulationResults.medianEndingBalance,
            worstCaseBalance: simulationResults.worstCaseBalance,
            bestCaseBalance: simulationResults.bestCaseBalance
        };
    }
}

export const fireCalculationService = new FireCalculationService(); 