# React Hot Toast Integration Guide

## 📦 Đã cài đặt

- ✅ `react-hot-toast` v2.6.0
- ✅ `Toaster` component trong `main.tsx`
- ✅ Custom hook `useToast` tại `@shared/hooks/useToast`
- ✅ Auto error handling trong axios interceptor

## 🎨 Sử dụng cơ bản

### 1. Import hook

```typescript
import { useToast } from '@shared/hooks/useToast';
```

### 2. Các phương thức có sẵn

```typescript
const { success, error, loading, promise, dismiss } = useToast();

// Success notification
success('Lưu thành công');
success('Cập nhật thành công', 'Dữ liệu đã được cập nhật');

// Error notification
error('Có lỗi xảy ra');
error('Không thể lưu', 'Vui lòng kiểm tra lại thông tin');

// Loading notification (trả về toastId để dismiss sau)
const toastId = loading('Đang xử lý...');
// ... sau khi xong
dismiss(toastId);

// Promise notification (auto show loading -> success/error)
promise(
  fetchData(),
  {
    loading: 'Đang tải dữ liệu...',
    success: 'Tải thành công',
    error: 'Tải thất bại',
  }
);
```

## 🔧 Pattern sử dụng trong TanStack Query Mutations

### ✅ ĐÚNG - Pattern chuẩn

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@shared/hooks/useToast';

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (data: CreateItemData) => {
      return itemService.create(data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      success('Tạo mới thành công', `${response.data.name} đã được thêm`);
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'Vui lòng thử lại';
      error('Không thể tạo mới', message);
    },
  });
};
```

### ✅ Sử dụng trong component

```typescript
const { mutate, isPending } = useCreateItem();

const handleSubmit = (data: FormData) => {
  mutate(data, {
    onSuccess: () => {
      // Close dialog, reset form, etc.
      closeDialog();
    },
  });
};
```

## 🌐 Auto Error Handling (Axios Interceptor)

Các lỗi API tự động hiển thị toast:

- ✅ **401**: Phiên đăng nhập hết hạn (tự động redirect login)
- ✅ **403**: Không có quyền
- ✅ **404**: Không tìm thấy
- ✅ **409**: Dữ liệu xung đột
- ✅ **500**: Lỗi server
- ✅ **503**: Dịch vụ không khả dụng
- ✅ **Network**: Lỗi kết nối mạng

**Lưu ý**: Lỗi **400 (Bad Request)** không tự động show toast, để component tự xử lý validation errors.

## 🎯 Các trường hợp sử dụng

### 1. Form submission

```typescript
const { mutate, isPending } = useCreateBranch();

const onSubmit = (data: BranchFormData) => {
  mutate(data, {
    onSuccess: () => {
      form.reset();
      onClose();
    },
  });
};
```

### 2. Delete confirmation

```typescript
const { mutate: deleteBranch } = useDeleteBranch();
const { success } = useToast();

const handleDelete = (id: string) => {
  if (confirm('Bạn có chắc muốn xóa?')) {
    deleteBranch(id);
  }
};
```

### 3. Toggle status

```typescript
const { mutate: toggleStatus } = useToggleBranchStatus();

const handleToggle = (branchId: string) => {
  toggleStatus(branchId);
};
```

### 4. Copy/Clone

```typescript
const { mutate: cloneBranch } = useCloneBranch();

const handleClone = (branchId: string) => {
  cloneBranch(branchId);
  // Toast tự động show từ mutation hook
};
```

### 5. Import file

```typescript
const { mutate: importMenu, isPending } = useImportMenu();
const { promise } = useToast();

const handleImport = (file: File) => {
  const uploadPromise = importMenu(file);
  
  promise(uploadPromise, {
    loading: 'Đang import...',
    success: (data) => `Đã import ${data.count} món thành công`,
    error: 'Import thất bại',
  });
};
```

## 🎨 Customization

Toast đã được style sẵn với:
- Position: `top-right`
- Duration: `3000ms` (success), `4000ms` (error)
- Custom colors: success (green), error (red)
- Box shadow và border radius

Nếu cần custom cho một toast cụ thể:

```typescript
import toast from 'react-hot-toast';

toast.success('Custom toast', {
  duration: 5000,
  position: 'top-center',
  style: {
    background: '#10b981',
    color: '#fff',
  },
});
```

## ❌ Những điều KHÔNG nên làm

```typescript
// ❌ SAI - Không gọi toast trực tiếp trong component render
function MyComponent() {
  useToast().success('Hello'); // KHÔNG
  return <div>...</div>;
}

// ❌ SAI - Không show toast cho mọi error (400 để component tự handle)
onError: (err) => {
  if (err.response?.status === 400) {
    toast.error(...); // KHÔNG - axios interceptor đã skip 400
  }
}

// ❌ SAI - Không show toast 2 lần cho cùng 1 action
onSuccess: () => {
  toast.success('OK');
  toast.success('Done'); // KHÔNG
}

// ✅ ĐÚNG - Chỉ 1 toast per action
onSuccess: () => {
  toast.success('Thành công');
}
```

## 📝 Checklist Integration

- [x] Cài đặt `react-hot-toast`
- [x] Setup `<Toaster />` trong `main.tsx`
- [x] Tạo custom hook `useToast`
- [x] Integrate vào axios interceptor
- [x] Update `useCreateBranch` mutation
- [ ] Tạo các mutation hooks khác (update, delete, toggle)
- [ ] Thêm toast vào form validations khi cần
- [ ] Test toast với các error cases khác nhau

## 🔗 Tài liệu tham khảo

- [React Hot Toast Docs](https://react-hot-toast.com/)
- [TanStack Query Mutations](https://tanstack.com/query/latest/docs/react/guides/mutations)
