import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Table2,
  Banknote,
  QrCode,
  Loader2
} from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';
import { useOrderStore } from '@modules/order/stores/orderStore';
import { paymentService } from '@modules/order/services/paymentService';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Tiền mặt', icon: <Wallet className="w-6 h-6 text-green-500" /> },
  { id: 'card', name: 'Thẻ ngân hàng', icon: <CreditCard className="w-6 h-6 text-blue-500" /> },
  { id: 'qr', name: 'Chuyển khoản / QR', icon: <Smartphone className="w-6 h-6 text-orange-500" /> },
];

const PaymentPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [amountReceived, setAmountReceived] = useState<number | ''>('');
  const [qrStep, setQrStep] = useState<'IDLE' | 'GENERATING' | 'READY'>('IDLE');
  const [qrData, setQrData] = useState<{ qrCode: string; reference: string } | null>(null);
  
  const { lastOrder, resetLastOrder, updateOrderStatus } = useOrderStore();
  const navigate = useNavigate();

  // Nếu không có đơn hàng để thanh toán thì quay về màn order
  useEffect(() => {
    if (!lastOrder) {
      toast.error('Không tìm thấy đơn hàng cần thanh toán');
      navigate(ROUTES.POS_ORDER);
    }
  }, [lastOrder, navigate]);

  const total = lastOrder?.totalAmount || 0;
  const items = lastOrder?.items || [];
  const orderNumber = lastOrder?.orderNumber || 'N/A';

  const changeAmount = useMemo(() => {
    if (typeof amountReceived !== 'number') return 0;
    return Math.max(0, amountReceived - total);
  }, [amountReceived, total]);

  const canConfirm = useMemo(() => {
    if (selectedMethod === 'cash') {
      return typeof amountReceived === 'number' && amountReceived >= total;
    }
    return true;
  }, [selectedMethod, amountReceived, total]);

  useEffect(() => {
    const handleQR = async () => {
      if (selectedMethod === 'qr' && lastOrder) {
        setQrStep('GENERATING');
        try {
          const response = await paymentService.generateQRPayment(lastOrder.id);
          if (response.success) {
            setQrData(response.data);
            setQrStep('READY');
          }
        } catch (err) {
          toast.error('Không thể tạo mã QR. Vui lòng thử lại.');
          setQrStep('IDLE');
        }
      } else {
        setQrStep('IDLE');
        setQrData(null);
      }
    };
    handleQR();
  }, [selectedMethod, lastOrder]);

  // Polling trạng thái thanh toán QR
  useEffect(() => {
    let interval: any;
    
    const checkStatus = async () => {
      if (selectedMethod === 'qr' && lastOrder && qrStep === 'READY') {
        try {
          const response = await paymentService.checkPaymentStatus(lastOrder.id);
          // Backend trả về status của Order hoặc Payment
          if (response.data.status === 'COMPLETED' || response.data.status === 'PAID') {
             await updateOrderStatus(lastOrder.id, 'COMPLETED');
             setIsSuccess(true);
             toast.success('Thanh toán QR thành công!');
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }
    };

    if (selectedMethod === 'qr' && qrStep === 'READY') {
      interval = setInterval(checkStatus, 4000); // Poll mỗi 4 giây
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedMethod, qrStep, lastOrder]);

  const handlePay = async () => {
    if (!lastOrder) return;

    setIsProcessing(true);
    try {
      if (selectedMethod === 'cash') {
        const response = await paymentService.processCashPayment({
          orderId: lastOrder.id,
          amountReceived: Number(amountReceived)
        });
        if (response.success) {
          await updateOrderStatus(lastOrder.id, 'COMPLETED');
          setIsSuccess(true);
        }
      } else if (selectedMethod === 'qr') {
        // Kiểm tra thủ công một lần nữa nếu khách bấm nút
        const response = await paymentService.checkPaymentStatus(lastOrder.id);
        if (response.data.status === 'COMPLETED' || response.data.status === 'PAID') {
          await updateOrderStatus(lastOrder.id, 'COMPLETED');
          setIsSuccess(true);
        } else {
          toast.error('Chưa nhận được thanh toán. Vui lòng quét mã QR.');
        }
      }
    } catch {
      toast.error('Thanh toán thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-[32px] p-12 text-center shadow-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-32 h-32 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Thanh toán hoàn tất!</h1>
        <p className="text-slate-500 text-lg mb-8 max-w-md font-medium">Đơn hàng đã được xử lý thành công. Hóa đơn đã được gửi đến hàng đợi in.</p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="h-14 px-8 rounded-2xl border-2 font-bold hover:bg-slate-50 transition-all"
          >
            <Receipt className="mr-2 w-5 h-5" />
            In hóa đơn
          </Button>
            <Button 
            className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 font-bold shadow-lg shadow-orange-100 transition-all"
            onClick={() => {
              resetLastOrder();
              navigate(ROUTES.POS_ORDER);
            }}
          >
            Đơn hàng mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6 overflow-hidden p-2">
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <header className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-2xl w-12 h-12 hover:bg-white hover:shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Thanh toán</h1>
            <p className="text-slate-500 font-medium">Xác nhận giao dịch và in hóa đơn</p>
          </div>
        </header>

        <div className="flex-1 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col gap-8 overflow-hidden">
          <div className="flex flex-col gap-4 overflow-hidden flex-1">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-orange-500" />
              Chi tiết đơn hàng
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-300 italic">
                  Không có sản phẩm nào
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-xl font-black text-slate-700">{item.quantity}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{item.itemName}</span>
                        <span className="text-xs text-slate-400 font-medium">{item.unitPrice.toLocaleString('vi-VN')} ₫ / món</span>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">{(item.unitPrice * item.quantity).toLocaleString('vi-VN')} ₫</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center text-slate-500 font-medium">
              <span>Mã đơn hàng:</span>
              <span className="font-bold text-slate-700">{orderNumber}</span>
            </div>
            <div className="flex justify-between text-4xl font-black text-slate-900 mt-2 tracking-tighter">
              <span>Tổng thanh toán</span>
              <span className="text-orange-500">{total.toLocaleString('vi-VN')} ₫</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[480px] flex flex-col gap-6">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col gap-8 h-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800">Phương thức thanh toán</h2>
            <div className="grid grid-cols-1 gap-3">
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all duration-300 ${
                    selectedMethod === method.id 
                      ? 'border-orange-500 bg-orange-50 shadow-xl shadow-orange-500/5 lg:scale-[1.02]' 
                      : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center ${selectedMethod === method.id ? 'bg-white' : 'bg-slate-100'}`}>
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

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {selectedMethod === 'cash' && (
                <motion.div 
                  key="cash-ui"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-4 bg-slate-50 p-6 rounded-[24px] border border-slate-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Banknote className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-slate-700">Thanh toán tiền mặt</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Số tiền khách đưa</label>
                    <div className="relative">
                      <Input 
                        type="number"
                        placeholder="Nhập số tiền..."
                        className="h-14 pl-6 pr-12 rounded-2xl bg-white border-slate-100 text-xl font-black text-slate-800 focus-visible:ring-orange-500"
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(Number(e.target.value) || '')}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₫</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-slate-500 font-medium">Tiền thừa trả khách:</span>
                    <span className="text-xl font-black text-emerald-500">{changeAmount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </motion.div>
              )}

              {selectedMethod === 'qr' && (
                <motion.div 
                  key="qr-ui"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-[24px] border border-slate-100"
                >
                  <div className="w-full flex items-center gap-2 mb-2">
                    <QrCode className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-slate-700">Mã QR VietQR động</span>
                  </div>
                  
                  <div className="w-48 h-48 bg-white rounded-3xl p-3 shadow-inner flex items-center justify-center border-2 border-dashed border-slate-200">
                    {qrStep === 'GENERATING' ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Đang sinh mã...</span>
                      </div>
                    ) : qrData ? (
                      <motion.img 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={qrData.qrCode}
                        alt="VietQR"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-slate-400 text-xs">Mã lỗi</div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái giao dịch</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-sm font-bold text-blue-600">Đang chờ thanh toán...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-50">
            <Button 
              disabled={isProcessing || !canConfirm || !lastOrder}
              onClick={handlePay}
              className={`w-full h-16 rounded-[24px] text-xl font-black shadow-xl transition-all active:scale-95 group ${
                canConfirm 
                  ? 'bg-slate-900 hover:bg-orange-500 text-white shadow-slate-200' 
                  : 'bg-slate-100 text-slate-400 shadow-none'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Đang xác thực...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {!canConfirm ? 'Vui lòng nhập đủ tiền' : 'Xác nhận Đã thanh toán'}
                  {canConfirm && <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />}
                </div>
              )}
            </Button>
            <p className="text-center text-slate-400 text-[11px] font-medium leading-relaxed mt-4 px-4">
              Xác nhận thanh toán sẽ cập nhật trạng thái đơn hàng và in hóa đơn GTGT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
