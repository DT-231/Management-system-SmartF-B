import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@shared/hooks/useToast';
import { branchService } from '../services/branchService';
import type { EditBranchFormData } from '../types/branch.types';

/**
 * Hook xử lý cập nhật thông tin chi nhánh
 */
export const useEditBranch = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EditBranchFormData }) => {
      return branchService.update(id, data);
    },
    onSuccess: (response, variables) => {
      // Invalidate queries để refetch danh sách và chi tiết
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch', variables.id] });

      success(
        'Cập nhật thành công',
        `Thông tin chi nhánh ${response.data.name} đã được cập nhật`
      );
    },
    onError: (err) => {
      console.error('Failed to update branch:', err);
      const errorMessage = err instanceof Error ? err.message : 'Vui lòng thử lại sau';
      error('Không thể cập nhật', errorMessage);
    },
  });
};
