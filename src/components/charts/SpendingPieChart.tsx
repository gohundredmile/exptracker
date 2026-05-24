import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAppStore } from '../../store/useAppStore';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../lib/helpers';
import type { PieLabelRenderProps } from 'recharts';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) return null;
  if ((percent as number) < 0.05) return null;

  const radius = (innerRadius as number) + ((outerRadius as number) - (innerRadius as number)) * 0.5;
  const x = (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN);
  const y = (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${((percent as number) * 100).toFixed(0)}%`}
    </text>
  );
};

interface TooltipEntry {
  name: string;
  value: number;
  payload: { icon: string };
}

const CustomTooltip = ({ active, payload, currency }: {
  active?: boolean;
  payload?: TooltipEntry[];
  currency: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#16213E] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {payload[0].payload.icon} {payload[0].name}
        </p>
        <p className="text-sm text-[#6C63FF] font-bold mt-1">
          {formatCurrency(payload[0].value, currency)}
        </p>
      </div>
    );
  }
  return null;
};

interface SpendingPieChartProps {
  month?: string;
}

export const SpendingPieChart: React.FC<SpendingPieChartProps> = ({ month }) => {
  const { profile, categories, selectedMonth } = useAppStore();
  const { getByMonth } = useTransactions();

  const targetMonth = month ?? selectedMonth;
  const transactions = getByMonth(targetMonth).filter(t => t.type === 'expense');

  const chartData = useMemo(() => {
    const spending = new Map<number, number>();
    transactions.forEach(t => {
      spending.set(t.category_id, (spending.get(t.category_id) ?? 0) + t.amount);
    });

    return Array.from(spending.entries())
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId);
        return {
          name: cat?.name ?? 'Unknown',
          value: amount,
          color: cat?.color ?? '#6C63FF',
          icon: cat?.icon ?? '📦',
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [transactions, categories]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Spending by Category</h3>
        <div className="text-center py-10">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No expense data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#16213E] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Spending by Category</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={90}
              innerRadius={40}
              dataKey="value"
              strokeWidth={2}
              stroke="transparent"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={(props) => {
              const active = props.active;
              const payload = props.payload as unknown as TooltipEntry[] | undefined;
              return <CustomTooltip active={active} payload={payload} currency={profile.currency} />;
            }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-2 space-y-1.5">
        {chartData.slice(0, 5).map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {item.icon} {item.name}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              {formatCurrency(item.value, profile.currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
