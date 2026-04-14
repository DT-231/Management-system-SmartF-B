import type { ApiResponse } from '@shared/types/api.types';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export type OrderSource = 'POS' | 'WEB' | 'MOBILE';

export interface OrderItemCommand {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  addons?: string[];
  notes?: string;
}

export interface PlaceOrderRequest {
  tableId?: string;
  source: OrderSource;
  notes?: string;
  items: OrderItemCommand[];
}

export interface UpdateOrderStatusRequest {
  newStatus: OrderStatus;
  reason?: string;
}

export interface OrderItemResponse {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface OrderResponse {
  id: string;
  tenantId: string;
  branchId: string;
  orderNumber: string;
  status: OrderStatus;
  source: OrderSource;
  tableId?: string;
  tableName?: string;
  notes?: string;
  totalAmount: number;
  items: OrderItemResponse[];
  createdAt: string;
}

export type OrderApiResponse = ApiResponse<OrderResponse>;
export type OrderListApiResponse = ApiResponse<OrderResponse[]>;

export interface CashPaymentRequest {
  orderId: string;
  amount: number;
}

export interface QRPaymentData {
  qrCode: string;
  orderId: string;
  amount: number;
  qrImage?: string;
}

export type QRPaymentApiResponse = ApiResponse<QRPaymentData>;
