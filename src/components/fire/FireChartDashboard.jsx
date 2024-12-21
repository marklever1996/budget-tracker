import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import './FireChartDashboard.css';

export const FireChartDashboard = ({ simulationData, inputs }) => {
    const formatCurrency = (value) => 
        new Intl.NumberFormat('nl-NL', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);

    const prepareChartData = () => {
        return simulationData.monthlyPercentiles.map((percentile, index) => ({
            month: index,
            worst: percentile.worst,
            percentile10: percentile.percentile10,
            median: percentile.median,
            percentile90: percentile.percentile90,
            best: percentile.best
        }));
    };

    const chartData = prepareChartData();

    return (
        <div className="fire-chart-dashboard">
            <div className="chart-container">
                <h3>Vermogensprojectie</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="month" 
                            label={{ value: 'Maanden', position: 'bottom' }}
                        />
                        <YAxis 
                            tickFormatter={formatCurrency}
                            label={{ 
                                value: 'Vermogen', 
                                angle: -90, 
                                position: 'insideLeft' 
                            }}
                        />
                        <Tooltip 
                            formatter={formatCurrency}
                            labelFormatter={(month) => `Maand ${month}`}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="best"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.1}
                            name="Beste scenario"
                        />
                        <Area
                            type="monotone"
                            dataKey="percentile90"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.1}
                            name="90e percentiel"
                        />
                        <Area
                            type="monotone"
                            dataKey="median"
                            stroke="#ffc658"
                            fill="#ffc658"
                            fillOpacity={0.1}
                            name="Mediaan"
                        />
                        <Area
                            type="monotone"
                            dataKey="percentile10"
                            stroke="#ff7300"
                            fill="#ff7300"
                            fillOpacity={0.1}
                            name="10e percentiel"
                        />
                        <Area
                            type="monotone"
                            dataKey="worst"
                            stroke="#ff0000"
                            fill="#ff0000"
                            fillOpacity={0.1}
                            name="Slechtste scenario"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="statistics-container">
                <div className="statistic-card">
                    <h4>Slagingskans</h4>
                    <p>{simulationData.successRate.toFixed(1)}%</p>
                </div>
                <div className="statistic-card">
                    <h4>Mediaan eindbedrag</h4>
                    <p>{formatCurrency(simulationData.medianEndingBalance)}</p>
                </div>
                <div className="statistic-card">
                    <h4>Slechtste scenario</h4>
                    <p>{formatCurrency(simulationData.worstCaseBalance)}</p>
                </div>
                <div className="statistic-card">
                    <h4>Beste scenario</h4>
                    <p>{formatCurrency(simulationData.bestCaseBalance)}</p>
                </div>
            </div>
        </div>
    );
}; 