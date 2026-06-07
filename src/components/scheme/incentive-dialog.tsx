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
  CheckboxGroup,
  Checkbox,
} from "@heroui/react";
import ObligationGroupEditor from "./obligation-group-editor";
import {
  Incentive,
  ObligationGroup,
  defaultIncentive,
  defaultObligationGroup,
  payoutUnitOptions,
} from "@/types/scheme";

interface IncentiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (incentive: Incentive) => void;
  initialData?: Incentive;
  title?: string;
  billingProductGroupNames: string[];
  allProductGroupNames: string[];
  isMarketMakerScheme: boolean;
}

export default function IncentiveDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  title = "Add Incentive",
  billingProductGroupNames,
  allProductGroupNames,
  isMarketMakerScheme,
}: IncentiveDialogProps) {
  const [data, setData] = useState<Incentive>(
    initialData || { ...defaultIncentive, obligations: { ...defaultObligationGroup } }
  );

  useEffect(() => {
    if (isOpen) {
      setData(
        initialData || { ...defaultIncentive, obligations: { ...defaultObligationGroup } }
      );
    }
  }, [isOpen, initialData]);

  const handleChange = (field: keyof Incentive, value: unknown) => {
    setData({ ...data, [field]: value });
  };

  const handleObligationsChange = (obligations: ObligationGroup) => {
    setData({ ...data, obligations });
  };

  const handleProductGroupsChange = (selected: string[]) => {
    setData({ ...data, applicableProductGroupNames: selected });
  };

  const handleSave = () => {
    if (data.payoutUnit && data.payoutRate > 0) {
      onSave(data);
      onClose();
    }
  };

  const isValid = data.payoutUnit && data.payoutRate > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside" classNames={{ base: "max-w-4xl" }}>
      <ModalContent>
        <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
          {title}
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="space-y-6">
            {/* Applicable Product Groups */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Applicable Product Groups
              </label>
              {billingProductGroupNames.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No billing products defined. Add billing products first.
                </p>
              ) : (
                <CheckboxGroup
                  value={data.applicableProductGroupNames || []}
                  onValueChange={handleProductGroupsChange}
                  orientation="horizontal"
                  classNames={{ wrapper: "gap-4" }}
                >
                  {billingProductGroupNames.map((name) => (
                    <Checkbox key={name} value={name}>
                      {name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            </div>

            {/* Payout Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                step="0.01"
                label="Payout Rate"
                labelPlacement="outside"
                placeholder="Enter rate"
                value={data.payoutRate?.toString() || ""}
                onChange={(e) =>
                  handleChange("payoutRate", parseFloat(e.target.value) || 0)
                }
                isRequired
              />

              <Select
                label="Payout Unit"
                labelPlacement="outside"
                placeholder="Select payout unit"
                selectedKeys={data.payoutUnit ? [data.payoutUnit] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  handleChange("payoutUnit", selected);
                }}
                isRequired
                disableAnimation
              >
                {payoutUnitOptions.map((option) => (
                  <SelectItem key={option.value}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Obligations */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Obligations
              </label>
              <ObligationGroupEditor
                group={data.obligations}
                onChange={handleObligationsChange}
                label="Obligation Rules"
                productGroupNames={allProductGroupNames}
                isMarketMakerScheme={isMarketMakerScheme}
              />
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
