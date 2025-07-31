import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Sample data for the chart
const salesData = [
  { name: "Jan", sales: 145, revenue: 85000 },
  { name: "Feb", sales: 132, revenue: 78000 },
  { name: "Mar", sales: 198, revenue: 125000 },
  { name: "Apr", sales: 167, revenue: 102000 },
  { name: "May", sales: 224, revenue: 145000 },
  { name: "Jun", sales: 189, revenue: 118000 },
  { name: "Jul", sales: 256, revenue: 162000 },
];

interface DashboardChartProps {
  title: string;
  type?: "area" | "line" | "bar";
  data?: typeof salesData;
}

export function DashboardChart({ title, type = "area", data = salesData }: DashboardChartProps) {
  const maxValue = Math.max(...data.map(d => d.sales));
  
  return (
    <Card className="p-6 shadow-modern">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-lg font-semibold text-card-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 flex items-end justify-between space-x-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex flex-col items-center flex-1">
              {/* Bar */}
              <div 
                className="w-full bg-[var(--uber-green)] rounded-t-md mb-2 transition-all hover:bg-[var(--uber-green-dark)]"
                style={{ 
                  height: `${(item.sales / maxValue) * 200}px`,
                  maxHeight: '200px'
                }}
              />
              {/* Label */}
              <span className="text-xs text-muted-foreground">{item.name}</span>
              {/* Value */}
              <span className="text-xs font-medium text-card-foreground">{item.sales}</span>
            </div>
          ))}
        </div>
        
        {/* Chart Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[var(--uber-green)]"></div>
            <span className="text-sm text-muted-foreground">Sales</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <span className="text-sm text-muted-foreground">Target</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
