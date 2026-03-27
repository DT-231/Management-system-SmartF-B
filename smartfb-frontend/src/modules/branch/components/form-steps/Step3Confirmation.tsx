import { useState } from "react";
import {
  Copy,
  FileSpreadsheet,
  Table2,
  Menu,
  Upload,
  ChevronDown,
} from "lucide-react";
import { Label } from "@shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@shared/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@shared/components/ui/collapsible";
import { cn } from "@shared/utils/cn";
import type {
  Step3ConfirmationData,
  TableSetupOption,
  MenuSetupOption,
} from "@modules/branch/types/branch.types";

interface Step3ConfirmationProps {
  data: Partial<Step3ConfirmationData>;
  onChange: (data: Partial<Step3ConfirmationData>) => void;
  errors?: Record<string, string>;
  summaryData?: {
    name?: string;
    address?: string;
    city?: string;
    phone?: string;
    workingDays?: number;
    integrations?: string[];
  };
}

const mockBranches = [
  { id: "branch-1", name: "Chi Nhánh Quận 1" },
  { id: "branch-2", name: "Chi Nhánh Quận 7" },
  { id: "branch-3", name: "Chi Nhánh Thủ Đức" },
];

/**
 * Get display text for current table setup selection
 */
const getTableSetupDisplayText = (
  option: TableSetupOption,
  copyFromBranchId?: string,
): string => {
  switch (option) {
    case "copy-from-branch": {
      const branch = mockBranches.find((b) => b.id === copyFromBranchId);
      return branch ? `Sao chép từ ${branch.name}` : "Chưa chọn chi nhánh";
    }
    case "use-template":
      return "Mẫu có sẵn (32 bàn)";
    case "setup-later":
      return "Tự thiết lập sau";
    default:
      return "Chưa chọn";
  }
};

/**
 * Get display text for current menu setup selection
 */
const getMenuSetupDisplayText = (
  option: MenuSetupOption,
  copyFromBranchId?: string,
): string => {
  switch (option) {
    case "copy-menu": {
      const branch = mockBranches.find((b) => b.id === copyFromBranchId);
      return branch ? `Sao chép từ ${branch.name}` : "Chưa chọn chi nhánh";
    }
    case "import-excel":
      return "Import từ file Excel";
    case "empty-menu":
      return "Menu trống";
    default:
      return "Chưa chọn";
  }
};

interface SetupCollapsibleProps {
  icon: React.ElementType;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  currentSelection: string;
  children: React.ReactNode;
}

/**
 * Reusable collapsible section for table/menu setup
 */
const SetupCollapsible = ({
  icon: Icon,
  iconBgClass,
  iconColorClass,
  title,
  isOpen,
  onToggle,
  currentSelection,
  children,
}: SetupCollapsibleProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <div className="border-2 border-orange-200 rounded-xl bg-orange-50/50 overflow-hidden">
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button className="w-full flex flex-row items-center  justify-between p-5 hover:bg-orange-100/50 transition-colors">
            <div className="flex items-center justify-around gap-3">
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  iconBgClass,
                )}
              >
                <Icon className={cn("w-5 h-5", iconColorClass)} />
              </div>
              <div className="flex flex-col ">
                <h3 className="text-sm font-semibold text-left text-gray-900 uppercase tracking-wide">
                  {title}
                </h3>
                <span className="text-xs text-left text-gray-500 ">
                  {currentSelection}
                </span>
              </div>
            </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-500 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
          </button>
        </CollapsibleTrigger>

        {/* Content */}
        <CollapsibleContent>
          <div className="px-5 pb-5">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

/**
 * Step 3: Xác nhận - Thiết lập bàn và thực đơn
 */
export const Step3Confirmation = ({
  data,
  onChange,
  errors,
  summaryData,
}: Step3ConfirmationProps) => {
  const [tableCollapsibleOpen, setTableCollapsibleOpen] = useState(false);
  const [menuCollapsibleOpen, setMenuCollapsibleOpen] = useState(false);

  const handleTableOptionChange = (value: TableSetupOption) => {
    onChange({
      ...data,
      tableSetupOption: value,
      copyTableFromBranchId:
        value === "copy-from-branch" ? data.copyTableFromBranchId : undefined,
    });
  };

  const handleMenuOptionChange = (value: MenuSetupOption) => {
    onChange({
      ...data,
      menuSetupOption: value,
      copyMenuFromBranchId:
        value === "copy-menu" ? data.copyMenuFromBranchId : undefined,
      importMenuFile:
        value === "import-excel" ? data.importMenuFile : undefined,
    });
  };

  const handleMenuFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({ ...data, importMenuFile: file });
    }
  };

  const currentTableSelection = getTableSetupDisplayText(
    data.tableSetupOption || "use-template",
    data.copyTableFromBranchId,
  );

  const currentMenuSelection = getMenuSetupDisplayText(
    data.menuSetupOption || "copy-menu",
    data.copyMenuFromBranchId,
  );

  return (
    <div className="space-y-4">
      {/* Two-column collapsible setup sections */}
      <div className="grid grid-cols-2 gap-4">
        {/* Thiết lập bàn */}
        <SetupCollapsible
          icon={Table2}
          iconBgClass="bg-orange-100"
          iconColorClass="text-orange-600"
          title="Thiết lập bàn"
          isOpen={tableCollapsibleOpen}
          onToggle={() => setTableCollapsibleOpen(!tableCollapsibleOpen)}
          currentSelection={currentTableSelection}
        >
          <RadioGroup
            value={data.tableSetupOption}
            onValueChange={handleTableOptionChange}
          >
            <div className="space-y-3">
              {/* Sao chép từ chi nhánh khác */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-300 bg-white">
                <RadioGroupItem value="copy-from-branch" id="table-copy" />
                <div className="flex-1">
                  <Label
                    htmlFor="table-copy"
                    className="font-medium cursor-pointer flex items-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4 text-orange-600" />
                    Sao chép từ chi nhánh khác
                  </Label>
                  {data.tableSetupOption === "copy-from-branch" && (
                    <div className="mt-2">
                      <Select
                        value={data.copyTableFromBranchId || ""}
                        onValueChange={(value) =>
                          onChange({ ...data, copyTableFromBranchId: value })
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Chọn chi nhánh" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockBranches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors?.copyTableFromBranchId && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.copyTableFromBranchId}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tạo theo mẫu có sẵn */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors">
                <RadioGroupItem value="use-template" id="table-template" />
                <div className="flex-1">
                  <Label
                    htmlFor="table-template"
                    className="font-medium cursor-pointer flex items-center gap-2 text-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-orange-600" />
                    Tạo theo mẫu có sẵn
                  </Label>
                </div>
              </div>

              {/* Tự thiết lập sau */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors">
                <RadioGroupItem value="setup-later" id="table-later" />
                <Label
                  htmlFor="table-later"
                  className="font-medium cursor-pointer w-full text-sm"
                >
                  Tự thiết lập sau
                </Label>
              </div>
            </div>
          </RadioGroup>
        </SetupCollapsible>

        {/* Thiết lập thực đơn */}
        <SetupCollapsible
          icon={Menu}
          iconBgClass="bg-orange-100"
          iconColorClass="text-orange-600"
          title="Thiết lập thực đơn"
          isOpen={menuCollapsibleOpen}
          onToggle={() => setMenuCollapsibleOpen(!menuCollapsibleOpen)}
          currentSelection={currentMenuSelection}
        >
          <RadioGroup
            value={data.menuSetupOption}
            onValueChange={handleMenuOptionChange}
          >
            <div className="space-y-3">
              {/* Sao chép menu */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-orange-300 bg-white">
                <RadioGroupItem value="copy-menu" id="menu-copy" />
                <div className="flex-1">
                  <Label
                    htmlFor="menu-copy"
                    className="font-medium cursor-pointer flex items-center gap-2 text-sm"
                  >
                    <Copy className="w-4 h-4 text-orange-600" />
                    Sao chép menu
                  </Label>
                  {data.menuSetupOption === "copy-menu" && (
                    <div className="mt-2">
                      <Select
                        value={data.copyMenuFromBranchId || ""}
                        onValueChange={(value) =>
                          onChange({ ...data, copyMenuFromBranchId: value })
                        }
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Chọn chi nhánh" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockBranches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors?.copyMenuFromBranchId && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.copyMenuFromBranchId}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Import từ Excel */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors">
                <RadioGroupItem value="import-excel" id="menu-excel" />
                <div className="flex-1">
                  <Label
                    htmlFor="menu-excel"
                    className="font-medium cursor-pointer flex items-center gap-2 text-sm"
                  >
                    <Upload className="w-4 h-4 text-orange-600" />
                    Import từ Excel
                  </Label>
                  {data.menuSetupOption === "import-excel" && (
                    <div className="mt-2">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleMenuFileChange}
                        className="text-sm text-gray-600"
                      />
                      {data.importMenuFile && (
                        <p className="text-xs text-green-600 mt-1">
                          ✓ Đã chọn: {(data.importMenuFile as File).name}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bắt đầu với menu trống */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-orange-300 transition-colors">
                <RadioGroupItem value="empty-menu" id="menu-empty" />
                <Label
                  htmlFor="menu-empty"
                  className="font-medium cursor-pointer w-full text-sm"
                >
                  Bắt đầu với menu trống
                </Label>
              </div>
            </div>
          </RadioGroup>
        </SetupCollapsible>
      </div>

      {/* Tóm tắt thông tin */}
      {summaryData && (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Tóm tắt chi nhánh sẽ tạo
            </h3>
            <button className="text-xs text-orange-600 hover:text-orange-700 font-medium">
              Chỉnh sửa
            </button>
          </div>

          <div className="grid grid-cols-4 gap-x-3 gap-y-4 text-xs">
            <div>
              <span className="text-gray-500 uppercase font-medium">
                Tên chi nhánh
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                {summaryData.name || "-"}
              </p>
            </div>
            <div>
              <span className="text-gray-500 uppercase font-medium">
                Mã số thuế
              </span>
              <p className="font-medium text-gray-900 mt-0.5">0312345678</p>
            </div>
            <div>
              <span className="text-gray-500 uppercase font-medium">
                Thực đơn
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                Clone Q.1 (48 món)
              </p>
            </div>
            <div>
              <span className="text-gray-500 uppercase font-medium">
                Thiết lập bàn
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                Clone Q.1 (32 bàn)
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500 uppercase font-medium">
                Địa chỉ
              </span>
              <p className="font-medium text-gray-900 mt-0.5">
                {summaryData.address}, {summaryData.city}
              </p>
            </div>
            <div>
              <span className="text-gray-500 uppercase font-medium">
                Giờ hoạt động
              </span>
              <p className="font-medium text-gray-900 mt-0.5">07:00 - 22:30</p>
            </div>

            <div>
              <span className="text-gray-500 uppercase font-medium">
                Quản lý
              </span>
              <p className="font-medium text-gray-900 mt-0.5">Lê Văn Nam</p>
            </div>
          </div>
        </div>
      )}

      {/* Lưu ý sau khi tạo */}
      <div className="border border-orange-200 rounded-xl p-5 bg-orange-50/30">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Lưu ý sau khi tạo:
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mt-0.5 shrink-0">
              <svg
                className="w-2.5 h-2.5 text-white"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">
              Thiết lập ca làm việc cho nhân viên mới
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mt-0.5 shrink-0">
              <svg
                className="w-2.5 h-2.5 text-white"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">
              Cập nhật số lượng tồn kho ban đầu
            </span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center mt-0.5 shrink-0">
              <svg
                className="w-2.5 h-2.5 text-white"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm text-gray-700">
              Kết nối với thiết bị in ấn tại chi nhánh
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};
