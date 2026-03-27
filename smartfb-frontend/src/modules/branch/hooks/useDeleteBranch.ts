import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@shared/constants/queryKeys';
import { branchService } from '../services/branchService';
import { useToast } from '@shared/hooks/useToast';

/**
 * Hook xóa chi nhánh
 * @returns mutation object để trigger xóa
 *
 * @example
 * const { deleteBranch, isPending } = useDeleteBranch();
 * deleteBranch('branch-id', {
 *   onSuccess: () => console.log('Xóa thành công'),
 * });
 */
export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  const { success,error } = useToast();

  return useMutation({
    mutationFn: (id: string) => branchService.delete(id),
    onSuccess: () => {
      // Invalidate để refetch danh sách
      queryClient.invalidateQueries({ queryKey: queryKeys.branches.all });
      success('Xóa chi nhánh thành công');
    },
    onError: (errors) => {
      error('Không thể xóa chi nhánh', errors.message);
    },
  });
};
