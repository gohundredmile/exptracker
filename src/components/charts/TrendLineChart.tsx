import React, { useMemo } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../lib/helpers';
import { eachDayOfInterval, parseISO, format, startOfMonth, endOfMonth } from 'date-fns';

interface TrendLineChartProps {
  month?: string;
}

const CustomTooltip = ({ active, payload, label, currency }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string;
  currency: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#16213E] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-bold text-[#6C63FF]">
          {formatCurrency(payload[0].value, currency)}
        </p>
      </div>
    );
  }
  return null;
};

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ month }) => {
  const { profile, selectedMonth } = useAppStore();
  const { getByMonth } = useTransactions();

  const targetMonth = month ?? selectedMonth;
  const transactions = getByMonth(targetMonth).filter(t => t.type === 'expense');

  const chartData = useMemo(() => {
    const monthDate = parseISO(`${targetMonth}-01`);
    const days = eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
    });

    let cumulative = 0;
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const daySpend = transactions
        .filter(t => t.date === dayStr)
        .reduce((s, t) => s + t.amount, 0);
      cumulative += daySpend;

      return {
        day: format(day, 'dd'),
        spent: cumulative,
        daily: daySpend,
      };
    });
  }, [transactions, targetMonth]);

  const maxValue = Math.max(...chartData.map(d => d.spent), 1);

  return (
    <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Spending Trend</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              interval={Math.floor(chartData.length / 6)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              domain={[0, maxValue * 1.1]}
              tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
            />
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  active={props.active}
                  payload={props.payload as unknown as Array<{ name: string; value: number }>}
                  label={props.label as string}
                  currency={profile.currency}
                />
              )}
            />
            <Area
              type="monotone"
              dataKey="spent"
              stroke="#6C63FF"
              strokeWidth={2.5}
              fill="url(#spendingGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#6C63FF' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
