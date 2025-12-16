import { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig: Record<OrderStatus, { color: string; label: string; icon: string }> = {
  PLACED: { color: 'bg-blue-50 text-blue-700 border border-blue-200', label: 'Placed', icon: '📝' },
  CONFIRMED: { color: 'bg-green-50 text-green-700 border border-green-200', label: 'Confirmed', icon: '✅' },
  PAID: { color: 'bg-purple-50 text-purple-700 border border-purple-200', label: 'Paid', icon: '💳' },
  ASSIGNED: { color: 'bg-yellow-50 text-yellow-700 border border-yellow-200', label: 'Assigned', icon: '👤' },
  OUT_FOR_DELIVERY: { color: 'bg-orange-50 text-orange-700 border border-orange-200', label: 'Out for Delivery', icon: '🚚' },
  DELIVERED: { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold', label: 'Delivered', icon: '🎉' },
  CANCELLED: { color: 'bg-red-50 text-red-700 border border-red-200', label: 'Cancelled', icon: '❌' },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${config.color} transition-all`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

