// import { api } from '@lib/axios';
import type { BranchDetailFull } from '../data/branchDetailMock';
import type { EditBranchFormData } from '../types/branch.types';
import type { ApiResponse } from '@shared/types/api.types';

/**
 * Branch service - gọi API cho các thao tác chi nhánh
 */
export const branchService = {
  /**
   * Lấy danh sách chi nhánh
   */
  getList: async () => {
    // TODO: Replace với real API
    const { mockBranchDetails } = await import('../data/branchDetails');
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockBranchDetails;
  },

  /**
   * Lấy chi tiết một chi nhánh
   */
  getById: async (id: string): Promise<ApiResponse<BranchDetailFull>> => {
    // TODO: Replace với real API
    const { branchDetailMock } = await import('../data/branchDetailMock');
    await new Promise(resolve => setTimeout(resolve, 300));

    if (id === branchDetailMock.id) {
      return { success: true, data: branchDetailMock };
    }

    throw new Error('Không tìm thấy chi nhánh');
  },

  /**
   * Cập nhật thông tin chi nhánh
   */
  update: async (id: string, payload: EditBranchFormData): Promise<ApiResponse<BranchDetailFull>> => {
    // TODO: Replace với real API call
    const { branchDetailMock } = await import('../data/branchDetailMock');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response - merge payload vào data hiện có
    const updatedBranch: BranchDetailFull = {
      ...branchDetailMock,
      id,
      ...payload,
    };

    return { success: true, data: updatedBranch };
  },

  /**
   * Toggle status chi nhánh
   */
  toggle: async (id: string): Promise<ApiResponse<BranchDetailFull>> => {
    // TODO: Replace với real API
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true,
      data: {
        id,
        status: 'active', // Mock - sẽ toggle từ active ↔ inactive
      } as BranchDetailFull
    };
  },

  /**
   * Xóa chi nhánh
   */
  delete: async (id: string): Promise<ApiResponse<void>> => {
    // TODO: Replace với real API
    await new Promise(resolve => setTimeout(resolve, 300));

    return { success: true, data: undefined };
  },
};
