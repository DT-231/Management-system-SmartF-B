import axiosInstance from '@lib/axios';
import type { ApiResponse } from '@shared/types/api.types';
import type { CashPaymentRequest, QRPaymentApiResponse } from '@modules/order/types/order.types';

export const paymentService = {
  async processCashPayment(payload: CashPaymentRequest): Promise<ApiResponse<any>> {
    const response = await axiosInstance.post<ApiResponse<any>>('/payments/cash', payload);
    return response.data;
  },

  async generateQRPayment(orderId: string): Promise<QRPaymentApiResponse> {
    const response = await axiosInstance.get<QRPaymentApiResponse>(`/payments/qr/${orderId}`);
    return response.data;
  },

  async checkPaymentStatus(orderId: string): Promise<ApiResponse<{ status: string }>> {
    const response = await axiosInstance.get<ApiResponse<{ status: string }>>(`/payments/status/${orderId}`);
    return response.data;
  }
};
