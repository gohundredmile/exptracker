import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../lib/helpers';
import { subMonths, format } from 'date-fns';

const CustomTooltip = ({ active, payload, label, currency }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
  currency: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#16213E] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-3">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
            <span className="text-gray-600 dark:text-gray-300">{entry.name}:</span>
            <span className="font-bold" style={{ color: entry.fill }}>
              {formatCurrency(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const IncomeExpenseBar: React.FC = () => {
  const { profile } = useAppStore();
  const { getByMonth } = useTransactions();

  const chartData = useMemo(() => {
    const months: Array<{ month: string; label: string }> = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      months.push({
        month: format(date, 'yyyy-MM'),
        label: format(date, 'MMM'),
      });
    }

    return months.map(({ month, label }) => {
      const txns = getByMonth(month);
      const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { name: label, Income: income, Expense: expense };
    });
  }, [getByMonth]);

  return (
    <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Income vs Expense</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
              tickFormatter={(v) => `${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
            />
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  active={props.active}
                  payload={props.payload as unknown as Array<{ name: string; value: number; fill: string }>}
                  label={props.label as string}
                  currency={profile.currency}
                />
              )}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
              )}
            />
            <Bar dataKey="Income" fill="#00C897" radius={[6, 6, 0, 0]} maxBarSize={30} />
            <Bar dataKey="Expense" fill="#FF6B6B" radius={[6, 6, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
