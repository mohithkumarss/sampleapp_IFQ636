import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// A nice color palette for your categories
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const CarbonChart = ({ activities }) => {
    // 1. Data Transformation: Group and sum emissions by 'type'
    const processChartData = () => {
        if (!activities || activities.length === 0) return [];

        const groupedData = activities.reduce((acc, curr) => {
            // If the category exists, add to it. If not, start it at 0.
            acc[curr.type] = (acc[curr.type] || 0) + curr.emission;
            return acc;
        }, {});

        // Convert the grouped object back into the array format Recharts needs
        return Object.keys(groupedData).map((key) => ({
            name: key,
            value: groupedData[key]
        }));
    };

    const data = processChartData();

    // 2. Fallback UI if they have no activities yet
    if (data.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                <p>No data to visualize yet. Log your first activity!</p>
            </div>
        );
    }

    // 3. Render the interactive Pie Chart
    return (
        <div style={{ width: '100%', height: 350, marginTop: '30px', backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Emission Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80} // Creates the "Donut" hole
                        outerRadius={110}
                        fill="#8884d8"
                        paddingAngle={5} // Space between slices
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Shows percentage outside the slice
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value) => `${value.toFixed(2)} kg CO₂`} 
                        itemStyle={{ color: '#333' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CarbonChart;