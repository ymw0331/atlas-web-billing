import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  CheckboxGroup,
  Checkbox,
} from "@heroui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  Obligation,
  obligationTypeOptions,
  valueTypeOptions,
  valueUnitOptions,
} from "@/types/scheme";

interface ObligationEditorProps {
  obligation: Obligation;
  onChange: (obligation: Obligation) => void;
  onDelete: () => void;
  displayId: string;
  productGroupNames: string[];
  borderColor?: string;
}

export default function ObligationEditor({
  obligation,
  onChange,
  onDelete,
  displayId,
  productGroupNames,
  borderColor = "border-gray-200 dark:border-gray-700",
}: ObligationEditorProps) {
  const handleChange = (field: keyof Obligation, value: unknown) => {
    onChange({ ...obligation, [field]: value });
  };

  const handleProductGroupsChange = (selected: string[]) => {
    handleChange("applicableProductGroupNames", selected);
  };

  // Generate summary text
  const getSummary = () => {
    const parts: string[] = [];

    // Product groups
    const groups = obligation.applicableProductGroupNames?.length
      ? obligation.applicableProductGroupNames.join(", ")
      : "All";
    parts.push(`if ${groups}`);

    // Obligation type and unit
    if (obligation.obligationType) {
      const unitText = obligation.valueUnit ? ` (${obligation.valueUnit})` : "";
      parts.push(`by ${obligation.obligationType}${unitText}`);
    }

    // Value range
    if (obligation.valueType && obligation.valueFrom !== undefined) {
      const valueTypeLabel = obligation.valueType === "GreaterThan" ? "Greater Than" : "Range";
      const valueText = obligation.valueType === "GreaterThan"
        ? `${valueTypeLabel} ${obligation.valueFrom}`
        : `${valueTypeLabel} ${obligation.valueFrom}${obligation.valueTo !== undefined ? ` ~ ${obligation.valueTo}` : ""}`;
      parts.push(valueText);
    }

    return parts.join(" ");
  };

  return (
    <Card className={`border-2 ${borderColor} shadow-none`}>
      <CardBody className="p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Obligation {displayId}
          </span>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            onPress={onDelete}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mb-3">{getSummary()}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Applicable Product Groups
            </label>
            {productGroupNames.length > 0 ? (
              <CheckboxGroup
                value={obligation.applicableProductGroupNames || []}
                onValueChange={handleProductGroupsChange}
                orientation="horizontal"
                size="sm"
                classNames={{ wrapper: "gap-3" }}
              >
                {productGroupNames.map((name) => (
                  <Checkbox key={name} value={name}>
                    {name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            ) : (
              <p className="text-sm text-gray-500">
                No product groups defined. Add products first.
              </p>
            )}
          </div>

          <div className="space-y-4">
            {/* Obligation Type */}
            <div className="flex">
              <Select
                label="Obligation Type"
                labelPlacement="outside"
                placeholder="Select type"
                size="sm"
                selectedKeys={obligation.obligationType ? [obligation.obligationType] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  handleChange("obligationType", selected);
                }}
                disableAnimation
              >
                {obligationTypeOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Value Unit and Value Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex">
                <Select
                  label="Value Unit"
                  labelPlacement="outside"
                  placeholder="Select unit"
                  size="sm"
                  selectedKeys={obligation.valueUnit ? [obligation.valueUnit] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleChange("valueUnit", selected);
                  }}
                  disableAnimation
                >
                  {valueUnitOptions.map((option) => (
                    <SelectItem key={option.value}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex">
                <Select
                  label="Value Type"
                  labelPlacement="outside"
                  placeholder="Select value type"
                  size="sm"
                  selectedKeys={obligation.valueType ? [obligation.valueType] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleChange("valueType", selected);
                  }}
                  disableAnimation
                >
                  {valueTypeOptions.map((option) => (
                    <SelectItem key={option.value}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            {/* Value From and Value To */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Value From"
                labelPlacement="outside"
                placeholder="Enter value"
                size="sm"
                value={obligation.valueFrom?.toString() || ""}
                onChange={(e) =>
                  handleChange("valueFrom", parseFloat(e.target.value) || 0)
                }
              />

              <Input
                type="number"
                label="Value To"
                labelPlacement="outside"
                placeholder="Enter value"
                size="sm"
                value={obligation.valueTo?.toString() || ""}
                onChange={(e) =>
                  handleChange("valueTo", parseFloat(e.target.value) || 0)
                }
                isDisabled={obligation.valueType === "GreaterThan"}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
