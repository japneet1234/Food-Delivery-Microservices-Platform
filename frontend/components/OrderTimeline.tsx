import { OrderStatus } from '@/types';
import { FiCheckCircle, FiClock, FiTruck, FiPackage, FiXCircle } from 'react-icons/fi';

interface OrderTimelineProps {
  status: OrderStatus;
}

const statusSteps: Array<{
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
}> = [
  { status: 'PLACED', label: 'Order Placed', icon: <FiClock className="w-5 h-5" /> },
  { status: 'CONFIRMED', label: 'Confirmed', icon: <FiCheckCircle className="w-5 h-5" /> },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <FiTruck className="w-5 h-5" /> },
  { status: 'DELIVERED', label: 'Delivered', icon: <FiPackage className="w-5 h-5" /> },
];

const statusOrder: OrderStatus[] = ['PLACED', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = statusOrder.indexOf(status);
  const isCancelled = status === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
        <FiXCircle className="w-6 h-6 text-red-600" />
        <div>
          <p className="font-semibold text-red-800">Order Cancelled</p>
          <p className="text-sm text-red-600">Your order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        {statusSteps.map((step, index) => {
          const stepIndex = statusOrder.indexOf(step.status);
          const isCompleted = stepIndex <= currentIndex;
          const isCurrent = stepIndex === currentIndex;

          return (
            <div key={step.status} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-orange-200 scale-110' : ''}`}
              >
                {step.icon}
              </div>
              <p
                className={`mt-2 text-xs font-medium text-center ${
                  isCompleted ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
        <div
          className="h-full bg-orange-600 transition-all duration-500"
          style={{
            width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

