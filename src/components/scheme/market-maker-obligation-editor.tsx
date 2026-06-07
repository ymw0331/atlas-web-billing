import {
  Card,
  CardBody,
  Button,
  Input,
  Checkbox,
  Select,
  SelectItem,
} from "@heroui/react";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  MarketMakerObligation,
  MarketMakerObligationTier,
  valueTypeOptions,
} from "@/types/scheme";

interface MarketMakerObligationEditorProps {
  obligation: MarketMakerObligation;
  onChange: (obligation: MarketMakerObligation) => void;
  onDelete: () => void;
  displayId: string;
  borderColor?: string;
}

export default function MarketMakerObligationEditor({
  obligation,
  onChange,
  onDelete,
  displayId,
  borderColor = "border-gray-200 dark:border-gray-700",
}: MarketMakerObligationEditorProps) {
  const handleChange = (field: keyof MarketMakerObligation, value: unknown) => {
    onChange({ ...obligation, [field]: value });
  };

  const handleTimeRangeChange = (field: "startTime" | "endTime", value: string) => {
    onChange({
      ...obligation,
      timeRange: { ...obligation.timeRange, [field]: value },
    });
  };

  const handleAddTier = () => {
    const newTier: MarketMakerObligationTier = {
      spread: 0,
      valueType: "Range",
      valueFrom: 0,
      valueTo: 0,
      valueUnit: "IndexPts",
    };
    onChange({
      ...obligation,
      obligationTiers: [...(obligation.obligationTiers || []), newTier],
    });
  };

  const handleTierChange = (tierIndex: number, field: keyof MarketMakerObligationTier, value: unknown) => {
    const tiers = [...(obligation.obligationTiers || [])];
    tiers[tierIndex] = { ...tiers[tierIndex], [field]: value };
    onChange({ ...obligation, obligationTiers: tiers });
  };

  const handleDeleteTier = (tierIndex: number) => {
    const tiers = (obligation.obligationTiers || []).filter((_, i) => i !== tierIndex);
    onChange({ ...obligation, obligationTiers: tiers });
  };

  return (
    <Card className={`border-2 ${borderColor} shadow-none`}>
      <CardBody className="p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            MM Obligation {displayId}
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

        <div className="space-y-4">
          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="time"
              label="Start Time"
              labelPlacement="outside"
              size="sm"
              value={obligation.timeRange.startTime}
              onChange={(e) => handleTimeRangeChange("startTime", e.target.value)}
            />
            <Input
              type="time"
              label="End Time"
              labelPlacement="outside"
              size="sm"
              value={obligation.timeRange.endTime}
              onChange={(e) => handleTimeRangeChange("endTime", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div />
            <div>
              <Checkbox
                isSelected={obligation.endTimeInNextDay}
                onValueChange={(checked) => handleChange("endTimeInNextDay", checked)}
                size="sm"
              >
                End time in next day
              </Checkbox>
            </div>
          </div>

          {/* Quote & Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Min Quote Time %"
              labelPlacement="outside"
              placeholder="e.g. 80.5"
              size="sm"
              value={obligation.minQuoteTimePercentage?.toString() || ""}
              onChange={(e) =>
                handleChange("minQuoteTimePercentage", parseFloat(e.target.value) || 0)
              }
            />
            <Input
              type="number"
              label="Min Size (Lots Each Side)"
              labelPlacement="outside"
              placeholder="e.g. 100"
              size="sm"
              value={obligation.minSizeInLotsOnEachSide?.toString() || ""}
              onChange={(e) =>
                handleChange("minSizeInLotsOnEachSide", parseInt(e.target.value) || 0)
              }
            />
          </div>

          {/* Obligation Tiers */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium">Obligation Tiers</span>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                startContent={<PlusIcon className="w-4 h-4" />}
                onPress={handleAddTier}
              >
                Add Tier
              </Button>
            </div>

            {(obligation.obligationTiers || []).length === 0 ? (
              <p className="text-sm text-gray-500">No tiers added</p>
            ) : (
              <div className="space-y-3">
                {(obligation.obligationTiers || []).map((tier, tierIndex) => (
                  <Card key={tierIndex} className="bg-gray-50 dark:bg-gray-800 shadow-none">
                    <CardBody className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Tier {tierIndex + 1}</span>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={() => handleDeleteTier(tierIndex)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        <Input
                          type="number"
                          label="Spread"
                          labelPlacement="outside"
                          size="sm"
                          value={tier.spread?.toString() || ""}
                          onChange={(e) =>
                            handleTierChange(tierIndex, "spread", parseFloat(e.target.value) || 0)
                          }
                        />
                        <Select
                          label="Value Type"
                          labelPlacement="outside"
                          size="sm"
                          selectedKeys={tier.valueType ? [tier.valueType] : []}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            handleTierChange(tierIndex, "valueType", selected);
                          }}
                          disableAnimation
                        >
                          {valueTypeOptions.map((option) => (
                            <SelectItem key={option.value}>{option.label}</SelectItem>
                          ))}
                        </Select>
                        <Input
                          type="number"
                          label="From"
                          labelPlacement="outside"
                          size="sm"
                          value={tier.valueFrom?.toString() || ""}
                          onChange={(e) =>
                            handleTierChange(tierIndex, "valueFrom", parseFloat(e.target.value) || 0)
                          }
                        />
                        <Input
                          type="number"
                          label="To"
                          labelPlacement="outside"
                          size="sm"
                          value={tier.valueTo?.toString() || ""}
                          onChange={(e) =>
                            handleTierChange(tierIndex, "valueTo", parseFloat(e.target.value) || 0)
                          }
                        />
                        <Input
                          label="Unit"
                          labelPlacement="outside"
                          size="sm"
                          value={tier.valueUnit}
                          isReadOnly
                        />
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
