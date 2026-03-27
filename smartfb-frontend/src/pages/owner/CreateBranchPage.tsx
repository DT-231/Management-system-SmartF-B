import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, LoaderCircle, ArrowLeft } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@shared/components/ui/stepper";
import { useToast } from "@shared/hooks/useToast";
import { useCreateBranch } from "@modules/branch/hooks/useCreateBranch";
import { Step1BasicInfo,Step2Operations,Step3Confirmation } from "@modules/branch/components/form-steps";
import type { CreateBranchFormData } from "@modules/branch/types/branch.types";
import { step1Schema ,step2Schema ,step3Schema} from "@modules/branch/schemas";
import type { ZodError } from "zod";
import { ROUTES } from "@shared/constants/routes";

const STEPS = [
  { id: 1, label: "Thông tin cơ bản" },
  { id: 2, label: "Vận hành" },
  { id: 3, label: "Xác nhận" },
];

const DEFAULT_SCHEDULE = {
  monday: { enabled: true, openTime: "07:00", closeTime: "22:30" },
  tuesday: { enabled: true, openTime: "07:00", closeTime: "22:30" },
  wednesday: { enabled: true, openTime: "07:00", closeTime: "22:30" },
  thursday: { enabled: true, openTime: "07:00", closeTime: "22:30" },
  friday: { enabled: true, openTime: "07:00", closeTime: "22:30" },
  saturday: { enabled: true, openTime: "08:00", closeTime: "23:00" },
  sunday: { enabled: false, openTime: "08:00", closeTime: "23:00" },
};

const INITIAL_FORM_DATA: CreateBranchFormData = {
  name: "",
  code: "",
  address: "",
  city: "",
  phone: "",
  managerId: "",
  taxCode: "",
  notes: "",
  workingSchedule: DEFAULT_SCHEDULE,
  integrations: { grabfood: false, shopeefood: false },
  tableSetupOption: "use-template",
  menuSetupOption: "copy-menu",
};

const getSchemaForStep = (step: number) => {
  switch (step) {
    case 1: return step1Schema;
    case 2: return step2Schema;
    case 3: return step3Schema;
    default: return step1Schema;
  }
};

/**
 * Trang tạo chi nhánh mới với wizard 3 bước
 */
export default function CreateBranchPage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const { mutate: createBranch, isPending } = useCreateBranch();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateBranchFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const validateCurrentStep = useCallback((data: CreateBranchFormData, step: number): Record<string, string> | null => {
    const schema = getSchemaForStep(step);
    try {
      schema.parse(data);
      return null;
    } catch (error) {
      const fieldErrors: Record<string, string> = {};
      const zodError = error as ZodError;
      zodError.issues.forEach((err) => {
        const fieldName = err.path.join('.');
        fieldErrors[fieldName] = err.message;
      });
      return fieldErrors;
    }
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  }, [currentStep]);

  const handleNext = useCallback(() => {
    const validationErrors = validateCurrentStep(formData, currentStep);

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  }, [formData, currentStep, validateCurrentStep]);

  const handleSubmit = useCallback(() => {
    createBranch(formData, {
      onSuccess: () => {
        success('Tạo chi nhánh thành công', `Chi nhánh "${formData.name}" đã được tạo 2222`);
        navigate(ROUTES.OWNER.BRANCHES);
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Không thể tạo chi nhánh';
        error('Có lỗi xảy ra', message);
      },
    });
  }, [createBranch, formData, success, error, navigate]);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm("Bạn có dữ liệu chưa lưu. Bạn có chắc muốn hủy?");
      if (!confirmCancel) return;
    }
    navigate(ROUTES.OWNER.BRANCHES);
  }, [hasUnsavedChanges, navigate]);

  const updateFormData = useCallback((data: Partial<CreateBranchFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setHasUnsavedChanges(true);
  }, []);

  const summaryData = useMemo(() => ({
    name: formData.name,
    address: formData.address,
    city: formData.city,
    phone: formData.phone,
    workingDays: formData.workingSchedule
      ? Object.values(formData.workingSchedule).filter((day) => day.enabled).length
      : 0,
    integrations: [
      formData.integrations?.grabfood && "GrabFood",
      formData.integrations?.shopeefood && "ShopeeFood",
    ].filter(Boolean) as string[],
  }), [formData]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="h-9 w-9 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Thêm chi nhánh mới</h1>
            <p className="text-sm text-gray-500">Điền thông tin để tạo chi nhánh mới</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleCancel} className="border-gray-300 text-gray-700">
          Hủy
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <Stepper
          value={currentStep}
          indicators={{
            completed: <Check className="size-4" />,
            loading: <LoaderCircle className="size-4 animate-spin" />,
          }}
          className="flex flex-col"
        >
          {/* Stepper Navigation */}
          <StepperNav className="mb-8">
            {STEPS.map((step, index) => (
              <StepperItem
                key={step.id}
                step={step.id}
                className="relative flex-1 items-start"
              >
                <StepperTrigger className="flex flex-col gap-2.5">
                  <StepperIndicator>{step.id}</StepperIndicator>
                  <StepperTitle className="text-xs">{step.label}</StepperTitle>
                </StepperTrigger>

                {STEPS.length > index + 1 && (
                  <StepperSeparator className="absolute top-3 inset-x-0 left-[calc(50%+0.875rem)] m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem+0.225rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none group-data-[state=completed]/step:bg-orange-500" />
                )}
              </StepperItem>
            ))}
          </StepperNav>

          {/* Stepper Content */}
          <StepperPanel className="min-h-[500px]">
            <StepperContent value={1}>
              <Step1BasicInfo
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </StepperContent>

            <StepperContent value={2}>
              <Step2Operations
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            </StepperContent>

            <StepperContent value={3}>
              <Step3Confirmation
                data={formData}
                onChange={updateFormData}
                errors={errors}
                summaryData={summaryData}
              />
            </StepperContent>
          </StepperPanel>
        </Stepper>

        {/* Action Buttons */}
        <div className="flex items-center justify-end pt-6 border-t border-gray-200 mt-6">
 
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isPending}
              >
                Quay lại
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </span>
              ) : currentStep < 3 ? (
                <span className="flex items-center gap-2">
                  Tiếp theo
                  <ChevronRight className="w-4 h-4" />
                </span>
              ) : (
                "Hoàn thành"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
