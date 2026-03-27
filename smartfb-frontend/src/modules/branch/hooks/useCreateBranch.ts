import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@shared/hooks/useToast';
import type { CreateBranchFormData } from '../types/branch.types';

/**
 * Hook xử lý tạo chi nhánh mới
 * TODO: Thay thế mock API bằng real API service khi backend sẵn sàng
 */
export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBranchFormData) => {
      // TODO: Replace với real API call
      // return branchService.create(data);

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Creating branch with data:', data);

      // Mock response
      return {
        success: true,
        data: {
          id: `branch-${Date.now()}`,
          ...data,
          status: 'active',
          createdAt: new Date().toISOString(),
        },
      };
    },
    onSuccess: (response) => {
      // Invalidate queries để refetch danh sách chi nhánh
      queryClient.invalidateQueries({ queryKey: ['branches'] });
    },
    onError: (err) => {
      console.error('Failed to create branch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Vui lòng thử lại sau';
      error('Không thể tạo chi nhánh', errorMessage);
    },
  });
};
