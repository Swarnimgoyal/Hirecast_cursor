"use client";

import { useMemo } from "react";

interface ProbabilityChartProps {
  yesPrice: number;
  noPrice: number;
  height?: number;
}

export const ProbabilityChart = ({ yesPrice, noPrice, height = 100 }: ProbabilityChartProps) => {
  // Generate dummy historical data points based on current price for visualization
  const dataPoints = useMemo(() => {
    const points = [];
    let currentPrice = yesPrice;
    
    // Generate 20 points going execution backwards
    for (let i = 0; i < 20; i++) {
       points.unshift(currentPrice);
       // Add some random volatility
       currentPrice = currentPrice + (Math.random() - 0.5) * 0.1; 
       // Clamp between 0.1 and 0.9
       currentPrice = Math.max(0.1, Math.min(0.9, currentPrice));
    }
    return points;
  }, [yesPrice]);

  const chartPath = useMemo(() => {
      const width = 100; // viewBox width
      const maxVal = 1;
      
      const pathD = dataPoints.map((val, index) => {
          const x = (index / (dataPoints.length - 1)) * width;
          const y = height - (val / maxVal) * height; 
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');

      // Fill area
      const fillPath = `${pathD} L ${width} ${height} L 0 ${height} Z`;
      
      return { line: pathD, fill: fillPath };
  }, [dataPoints, height]);

  return (
    <div className="w-full relative overflow-hidden rounded-lg bg-gray-900/50 border border-gray-800" style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9333ea" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={chartPath.fill} fill="url(#chartGradient)" />
            <path d={chartPath.line} fill="none" stroke="#a855f7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute top-2 left-2 text-xs text-purple-300 font-mono">
           YES Probability Trend
        </div>
    </div>
  );
};
