import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  Receipt, 
  Percent, 
  User, 
  Table2 
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

// Mock Order Summary
const MOCK_CART = [
  { id: '1', name: 'Cà phê Muối', price: 35000, quantity: 2 },
  { id: '2', name: 'Trà Đào Cam Sả', price: 45000, quantity: 1 },
];

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Tiền mặt', icon: <Wallet className="w-6 h-6 text-green-500" /> },
  { id: 'card', name: 'Thẻ ngân hàng', icon: <CreditCard className="w-6 h-6 text-blue-500" /> },
  { id: 'qr', name: 'Chuyển khoản / QR', icon: <Smartphone className="w-6 h-6 text-orange-500" /> },
];

const PaymentPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const subtotal = MOCK_CART.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-3xl p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-32 h-32 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Thanh toán thành công!</h1>
        <p className="text-slate-500 text-lg mb-8 max-w-md">Đơn hàng #3829 đã được xử lý. Yêu cầu in hóa đơn đã được gửi đến máy in bếp.</p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="h-12 px-8 rounded-2xl border-2 font-bold"
            onClick={() => setIsSuccess(false)}
          >
            In hóa đơn
          </Button>
          <Button 
            className="h-12 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 font-bold"
            onClick={() => navigate(ROUTES.POS_ORDER)}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Summary Section */}
      <div className="flex-1 flex flex-col gap-6">
        <header className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-full hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Thanh toán</h1>
            <p className="text-slate-500">Đơn hàng #3829 • Bàn 04 • Nhân viên: Alex</p>
          </div>
        </header>

        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-orange-500" />
              Chi tiết đơn hàng
            </h2>
            <div className="flex flex-col gap-4">
              {MOCK_CART.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-dashed border-slate-100 last:border-none">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-slate-100 flex items-center justify-center rounded-lg font-bold text-slate-700">{item.quantity}</span>
                    <span className="font-medium text-lg text-slate-800">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 border-t-2 border-slate-50 flex flex-col gap-3">
            <div className="flex justify-between text-lg text-slate-600">
              <span>Tạm tính</span>
              <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-lg text-slate-600">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                <span>VAT (8%)</span>
              </div>
              <span>{tax.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="flex justify-between text-3xl font-bold text-slate-900 mt-4">
              <span>Cần thanh toán</span>
              <span className="text-orange-500">{total.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Configuration */}
      <div className="w-[450px] flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 flex flex-col gap-8 h-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800">Phương thức thanh toán</h2>
            <div className="grid grid-cols-1 gap-4">
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${
                    selectedMethod === method.id 
                      ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-100' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    {method.icon}
                  </div>
                  <span className="font-bold text-lg text-slate-800">{method.name}</span>
                  {selectedMethod === method.id && (
                    <motion.div layoutId="check" className="ml-auto">
                      <CheckCircle2 className="w-7 h-7 text-orange-500" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800">Thông tin bổ sung</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Bàn</span>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Table2 className="w-4 h-4" />
                  Bàn 04
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                <span className="text-xs text-slate-400 font-bold uppercase">Khách hàng</span>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <User className="w-4 h-4" />
                  Khách lẻ
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <Button 
              disabled={isProcessing}
              onClick={handlePay}
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-orange-500 text-xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 group"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Xác nhận thanh toán
                  <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
            <p className="text-center text-slate-400 text-sm mt-4">Bằng việc xác nhận, bạn đồng ý với các điều khoản giao dịch của hệ thống SmartF&B.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
