// src/components/dashboard/StatsCard.tsx
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  change?: number;
  changeType?: "increase" | "decrease";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-muted-foreground",
  subtitle,
  trend,
  change,
  changeType
}) => {
  return (
    <div className="p-6 shadow-sm bg-card hover:shadow-md transition-shadow duration-200 rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-card-foreground">{value}</p>
          
          {(trend || (change !== undefined && changeType)) && (
            <div className="flex items-center space-x-1">
              {changeType === "increase" ? (
                <TrendingUp className="h-4 w-4 text-[var(--uber-green)]" />
              ) : changeType === "decrease" ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : null}
              {trend && (
                <span className={`text-sm font-medium ${trend.isPositive ? 'text-[var(--uber-green)]' : 'text-destructive'}`}>
                  {trend.value}
                </span>
              )}
              {change !== undefined && (
                <span className={`text-sm ${changeType === "increase" ? 'text-[var(--uber-green)]' : 'text-destructive'}`}>
                  {change > 0 ? '+' : ''}{change}%
                </span>
              )}
            </div>
          )}
          
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};
