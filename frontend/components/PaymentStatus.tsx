import { OrderStatus } from '@/types';
import { FiCreditCard, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

interface PaymentStatusProps {
  orderStatus: OrderStatus;
}

export default function PaymentStatus({ orderStatus }: PaymentStatusProps) {
  const getPaymentInfo = () => {
    switch (orderStatus) {
      case 'PLACED':
        return {
          status: 'processing',
          message: 'Processing payment...',
          icon: <FiLoader className="w-5 h-5 animate-spin text-blue-600" />,
          color: 'text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200',
          iconBg: 'bg-blue-100',
        };
      case 'CONFIRMED':
      case 'OUT_FOR_DELIVERY':
      case 'DELIVERED':
        return {
          status: 'success',
          message: 'Payment successful ✓',
          icon: <FiCheckCircle className="w-5 h-5 text-green-600" />,
          color: 'text-green-700 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200',
          iconBg: 'bg-green-100',
        };
      case 'CANCELLED':
        return {
          status: 'failed',
          message: 'Payment failed - order cancelled',
          icon: <FiXCircle className="w-5 h-5 text-red-600" />,
          color: 'text-red-700 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200',
          iconBg: 'bg-red-100',
        };
      default:
        return {
          status: 'processing',
          message: 'Processing payment...',
          icon: <FiLoader className="w-5 h-5 animate-spin text-blue-600" />,
          color: 'text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200',
          iconBg: 'bg-blue-100',
        };
    }
  };

  const paymentInfo = getPaymentInfo();

  return (
    <div className={`flex items-center gap-4 p-5 rounded-xl shadow-md ${paymentInfo.color}`}>
      <div className={`p-3 ${paymentInfo.iconBg} rounded-lg shadow-sm`}>
        <FiCreditCard className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-base mb-1">Payment Status</p>
        <p className="text-sm font-medium opacity-90">{paymentInfo.message}</p>
      </div>
      <div className="text-2xl">{paymentInfo.icon}</div>
    </div>
  );
}

