import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Chip,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
import {
  ProductFilter,
  ContractFilter,
  RollsFilter,
  defaultProductFilter,
  defaultTradeCategory,
  assetClassOptions,
  productCodeOptions,
  contractMonthOptions,
  contractCategoryOptions,
} from "@/types/scheme";

interface ProductFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (filter: ProductFilter) => void;
  initialData?: ProductFilter;
  title?: string;
}

export default function ProductFilterDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Add Product Filter",
}: ProductFilterDialogProps) {
  const [data, setData] = useState<ProductFilter>(
    initialData || { ...defaultProductFilter, tradeCategory: { ...defaultTradeCategory } }
  );
  const [productCodeInput, setProductCodeInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setData(
        initialData || { ...defaultProductFilter, tradeCategory: { ...defaultTradeCategory } }
      );
      setProductCodeInput("");
    }
  }, [isOpen, initialData]);

  const handleChange = (field: keyof ProductFilter, value: unknown) => {
    setData({ ...data, [field]: value });
  };

  const handleTradeCategoryChange = (field: keyof typeof data.tradeCategory, checked: boolean) => {
    setData({
      ...data,
      tradeCategory: { ...data.tradeCategory, [field]: checked },
    });
  };

  const handleContractFilterChange = (field: keyof ContractFilter, value: unknown) => {
    setData({
      ...data,
      contractFilter: { ...(data.contractFilter || {}), [field]: value },
    });
  };

  const handleRollsFilterChange = (field: keyof RollsFilter, value: unknown) => {
    setData({
      ...data,
      rollsFilter: { ...(data.rollsFilter || {}), [field]: value },
    });
  };

  const handleAddProductCode = (code: string) => {
    if (code && !data.productCodes.includes(code)) {
      setData({ ...data, productCodes: [...data.productCodes, code] });
    }
    setProductCodeInput("");
  };

  const handleRemoveProductCode = (code: string) => {
    setData({
      ...data,
      productCodes: data.productCodes.filter((c) => c !== code),
    });
  };

  const handleSave = () => {
    if (data.filterName && data.assetClass && data.productCodes.length > 0) {
      onSave(data);
      onClose();
    }
  };

  const isValid = data.filterName && data.assetClass && data.productCodes.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside" classNames={{ base: "max-w-4xl" }}>
      <ModalContent>
        <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
          {title}
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Filter Name"
                labelPlacement="outside"
                placeholder="Enter filter name"
                value={data.filterName}
                onChange={(e) => handleChange("filterName", e.target.value)}
                isRequired
              />
              <Select
                label="Asset Class"
                labelPlacement="outside"
                placeholder="Select asset class"
                selectedKeys={data.assetClass ? [data.assetClass] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  handleChange("assetClass", selected);
                }}
                isRequired
                disableAnimation
              >
                {assetClassOptions.map((option) => (
                  <SelectItem key={option}>{option}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Product Codes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Codes <span className="text-danger">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <Autocomplete
                  placeholder="Search product codes"
                  inputValue={productCodeInput}
                  onInputChange={setProductCodeInput}
                  onSelectionChange={(key) => {
                    if (key) handleAddProductCode(key as string);
                  }}
                  className="flex-1"
                  disableAnimation
                >
                  {productCodeOptions
                    .filter((code) => !data.productCodes.includes(code))
                    .map((code) => (
                      <AutocompleteItem key={code}>{code}</AutocompleteItem>
                    ))}
                </Autocomplete>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.productCodes.map((code) => (
                  <Chip
                    key={code}
                    onClose={() => handleRemoveProductCode(code)}
                    variant="flat"
                  >
                    {code}
                  </Chip>
                ))}
                {data.productCodes.length === 0 && (
                  <span className="text-sm text-gray-500">No product codes selected</span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Trade Category */}
            <div>
              <h4 className="text-base font-semibold mb-3">Trade Category</h4>
              <div className="flex flex-wrap gap-4">
                <Checkbox
                  isSelected={data.tradeCategory.electronic}
                  onValueChange={(checked) =>
                    handleTradeCategoryChange("electronic", checked)
                  }
                >
                  Electronic
                </Checkbox>
                <Checkbox
                  isSelected={data.tradeCategory.nlt}
                  onValueChange={(checked) => handleTradeCategoryChange("nlt", checked)}
                >
                  NLT
                </Checkbox>
                <Checkbox
                  isSelected={data.tradeCategory.maker}
                  onValueChange={(checked) => handleTradeCategoryChange("maker", checked)}
                >
                  Maker
                </Checkbox>
                <Checkbox
                  isSelected={data.tradeCategory.taker}
                  onValueChange={(checked) => handleTradeCategoryChange("taker", checked)}
                >
                  Taker
                </Checkbox>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Contract Filter */}
            <div>
              <h4 className="text-base font-semibold mb-3">Contract Filter</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Contract Category"
                  labelPlacement="outside"
                  placeholder="Select contract category"
                  selectedKeys={
                    data.contractFilter?.contractCategory
                      ? [data.contractFilter.contractCategory]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleContractFilterChange("contractCategory", selected || undefined);
                  }}
                  disableAnimation
                >
                  {contractCategoryOptions.map((option) => (
                    <SelectItem key={option}>{option}</SelectItem>
                  ))}
                </Select>
                <Select
                  label="Contract Month"
                  labelPlacement="outside"
                  placeholder="Select contract month"
                  selectedKeys={
                    data.contractFilter?.contractMonth
                      ? [data.contractFilter.contractMonth]
                      : []
                  }
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleContractFilterChange("contractMonth", selected || undefined);
                  }}
                  disableAnimation
                >
                  {contractMonthOptions.map((option) => (
                    <SelectItem key={option.value}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex flex-wrap gap-4 mt-3">
                <Checkbox
                  isSelected={data.contractFilter?.outrightTrade || false}
                  onValueChange={(checked) =>
                    handleContractFilterChange("outrightTrade", checked)
                  }
                >
                  Outright Trade
                </Checkbox>
                <Checkbox
                  isSelected={data.contractFilter?.calendarSpreadTrade || false}
                  onValueChange={(checked) =>
                    handleContractFilterChange("calendarSpreadTrade", checked)
                  }
                >
                  Calendar Spread Trade
                </Checkbox>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Rolls Filter */}
            <div>
              <h4 className="text-base font-semibold mb-3">Rolls Filter</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Roll Type"
                  labelPlacement="outside"
                  placeholder="Select roll type"
                  selectedKeys={data.rollsFilter?.rollType ? [data.rollsFilter.rollType] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleRollsFilterChange("rollType", selected || undefined);
                  }}
                  disableAnimation
                >
                  <SelectItem key="LTD">LTD</SelectItem>
                </Select>
                <Input
                  type="number"
                  label="Roll Out Start"
                  labelPlacement="outside"
                  placeholder="0"
                  value={data.rollsFilter?.rollOutStart?.toString() || ""}
                  onChange={(e) =>
                    handleRollsFilterChange("rollOutStart", parseInt(e.target.value) || 0)
                  }
                />
                <Input
                  type="number"
                  label="Roll In Start"
                  labelPlacement="outside"
                  placeholder="0"
                  value={data.rollsFilter?.rollInStart?.toString() || ""}
                  onChange={(e) =>
                    handleRollsFilterChange("rollInStart", parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-gray-200 dark:border-gray-700">
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave} isDisabled={!isValid}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
