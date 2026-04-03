import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@shared/components/ui/select';
import { useToast } from '@shared/hooks/useToast';
import { useCreateStaff } from '@modules/staff/hooks/useCreateStaff';
import { mockStaffList } from '@modules/staff/data/staffList';
import { mockBranchDetails } from '@modules/branch/data/branchDetails';
import { ROUTES } from '@shared/constants/routes';
import type { CreateStaffFormData, StaffRole, StaffDepartment } from '@modules/staff/types/staff.types';

type FormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  identityId: string;
  dateOfBirth: string;
  address: string;
  city: string;
  role: StaffRole;
  branchId: string;
  pinPos: string;
  status: 'active' | 'inactive';
  salary: number;
  hireDate: string;
};

const ROLES: { value: StaffRole; label: string }[] = [
  { value: 'manager', label: 'Quản lý' },
  { value: 'chef', label: 'Đầu bếp' },
  { value: 'waiter', label: 'Phục vụ' },
  { value: 'cashier', label: 'Thu ngân' },
  { value: 'staff', label: 'Nhân viên' },
];

const getDepartmentFromRole = (role: string): StaffDepartment => {
  const departmentMap: Record<string, StaffDepartment> = {
    manager: 'Quản lý',
    chef: 'Bếp',
    waiter: 'Phục vụ',
    cashier: 'Tính tiền',
    staff: 'Khác',
  };
  return departmentMap[role] || 'Khác';
};

export default function CreateStaffPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { mutate: createStaff, isPending } = useCreateStaff();

  const [values, setValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    identityId: '',
    dateOfBirth: '',
    address: '',
    city: '',
    role: 'staff',
    branchId: mockBranchDetails?.[0]?.id ?? '',
    pinPos: '',
    status: 'active',
    salary: 0,
    hireDate: new Date().toISOString().split('T')[0],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof FormValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!values.firstName.trim()) errors.firstName = 'Họ là bắt buộc';
    if (!values.lastName.trim()) errors.lastName = 'Tên là bắt buộc';
    if (!values.phone.trim()) errors.phone = 'Số điện thoại là bắt buộc';
    else if (!/^(0[1-9][0-9]{8})$/.test(values.phone)) {
      errors.phone = 'Số điện thoại phải có 10 số và bắt đầu bằng 0';
    }
    if (!values.identityId.trim()) errors.identityId = 'CMND/CCCD là bắt buộc';
    if (!values.dateOfBirth) errors.dateOfBirth = 'Ngày sinh là bắt buộc';
    if (!values.address.trim()) errors.address = 'Địa chỉ là bắt buộc';
    if (!values.city.trim()) errors.city = 'Thành phố là bắt buộc';
    if (!values.branchId) errors.branchId = 'Chi nhánh là bắt buộc';
    if (!values.pinPos.trim()) errors.pinPos = 'PIN POS là bắt buộc';
    if (!values.hireDate) errors.hireDate = 'Ngày vào làm là bắt buộc';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const duplicatePhone = mockStaffList.some((staff) => staff.phone === values.phone);
    if (duplicatePhone) {
      setFormErrors((prev) => ({ ...prev, phone: 'Số điện thoại đã tồn tại' }));
      return;
    }

    const branch = mockBranchDetails.find(b => b.id === values.branchId);
    
    const createPayload: CreateStaffFormData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email || '',
      phone: values.phone,
      identityId: values.identityId,
      dateOfBirth: values.dateOfBirth,
      address: values.address,
      city: values.city,
      branchId: values.branchId,
      branchName: branch?.name || '',
      role: values.role,
      department: getDepartmentFromRole(values.role),
      shiftType: 'full-time',
      salary: values.salary,
      hireDate: values.hireDate,
      pinPos: values.pinPos,
      status: values.status,
    };

    createStaff(createPayload, {
      onSuccess: () => {
        success('Thêm nhân viên thành công', `Nhân viên ${values.firstName} ${values.lastName} đã được thêm.`);
        navigate(ROUTES.OWNER.STAFF);
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Không thể xử lý thông tin nhân viên, vui lòng thử lại sau';
        error('Có lỗi xảy ra', message);
      },
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.OWNER.STAFF)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Thêm nhân viên mới</h1>
            <p className="text-sm text-gray-500">Điền thông tin để tạo tài khoản nhân viên</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Họ <span className="text-red-500">*</span></Label>
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            {formErrors.firstName && <p className="text-red-600 text-xs mt-1">{formErrors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="lastName">Tên <span className="text-red-500">*</span></Label>
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
            {formErrors.lastName && <p className="text-red-600 text-xs mt-1">{formErrors.lastName}</p>}
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              value={values.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="0912345678"
            />
            {formErrors.phone && <p className="text-red-600 text-xs mt-1">{formErrors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="nhanvien@example.com"
            />
            {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <Label htmlFor="identityId">CMND/CCCD <span className="text-red-500">*</span></Label>
            <Input
              id="identityId"
              value={values.identityId}
              onChange={(e) => handleChange('identityId', e.target.value)}
              placeholder="123456789012"
            />
            {formErrors.identityId && <p className="text-red-600 text-xs mt-1">{formErrors.identityId}</p>}
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Ngày sinh <span className="text-red-500">*</span></Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            />
            {formErrors.dateOfBirth && <p className="text-red-600 text-xs mt-1">{formErrors.dateOfBirth}</p>}
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ <span className="text-red-500">*</span></Label>
            <Input
              id="address"
              value={values.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Số nhà, đường"
            />
            {formErrors.address && <p className="text-red-600 text-xs mt-1">{formErrors.address}</p>}
          </div>

          <div>
            <Label htmlFor="city">Thành phố <span className="text-red-500">*</span></Label>
            <Input
              id="city"
              value={values.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="TP. Hồ Chí Minh"
            />
            {formErrors.city && <p className="text-red-600 text-xs mt-1">{formErrors.city}</p>}
          </div>

          <div>
            <Label htmlFor="role">Vị trí <span className="text-red-500">*</span></Label>
            <Select value={values.role} onValueChange={(val) => handleChange('role', val as StaffRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vị trí" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.role && <p className="text-red-600 text-xs mt-1">{formErrors.role}</p>}
          </div>

          <div>
            <Label htmlFor="branchId">Chi nhánh <span className="text-red-500">*</span></Label>
            <Select value={values.branchId} onValueChange={(val) => handleChange('branchId', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chi nhánh" />
              </SelectTrigger>
              <SelectContent>
                {mockBranchDetails.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.branchId && <p className="text-red-600 text-xs mt-1">{formErrors.branchId}</p>}
          </div>

          <div>
            <Label htmlFor="pinPos">PIN POS <span className="text-red-500">*</span></Label>
            <Input
              id="pinPos"
              type="password"
              value={values.pinPos}
              onChange={(e) => handleChange('pinPos', e.target.value)}
              placeholder="1234"
              maxLength={6}
            />
            {formErrors.pinPos && <p className="text-red-600 text-xs mt-1">{formErrors.pinPos}</p>}
          </div>

          <div>
            <Label htmlFor="salary">Lương (VNĐ)</Label>
            <Input
              id="salary"
              type="number"
              value={values.salary}
              onChange={(e) => handleChange('salary', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
            {formErrors.salary && <p className="text-red-600 text-xs mt-1">{formErrors.salary}</p>}
          </div>

          <div>
            <Label htmlFor="hireDate">Ngày vào làm <span className="text-red-500">*</span></Label>
            <Input
              id="hireDate"
              type="date"
              value={values.hireDate}
              onChange={(e) => handleChange('hireDate', e.target.value)}
            />
            {formErrors.hireDate && <p className="text-red-600 text-xs mt-1">{formErrors.hireDate}</p>}
          </div>

          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={values.status} onValueChange={(val) => handleChange('status', val as 'active' | 'inactive')}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang làm</SelectItem>
                <SelectItem value="inactive">Đã nghỉ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => navigate(ROUTES.OWNER.STAFF)} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Đang lưu...' : 'Tạo nhân viên'}
          </Button>
        </div>
      </div>
    </div>
  );
}