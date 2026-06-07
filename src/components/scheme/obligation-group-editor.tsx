import {
  Card,
  CardBody,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import ObligationEditor from "./obligation-editor";
import MarketMakerObligationEditor from "./market-maker-obligation-editor";
import {
  ObligationGroup,
  Obligation,
  MarketMakerObligation,
  obligationGroupTypeOptions,
  defaultObligation,
  defaultMarketMakerObligation,
  defaultObligationGroup,
} from "@/types/scheme";

interface ObligationGroupEditorProps {
  group: ObligationGroup;
  onChange: (group: ObligationGroup) => void;
  onDelete?: () => void;
  depth?: number;
  label?: string;
  productGroupNames: string[];
  isMarketMakerScheme: boolean;
  parentId?: string;
}

export default function ObligationGroupEditor({
  group,
  onChange,
  onDelete,
  depth = 0,
  label = "Obligations",
  productGroupNames,
  isMarketMakerScheme,
  parentId = "",
}: ObligationGroupEditorProps) {
  const handleTypeChange = (type: "AND" | "OR") => {
    onChange({ ...group, type });
  };

  // Obligation handlers
  const handleAddObligation = () => {
    onChange({
      ...group,
      obligations: [...(group.obligations || []), { ...defaultObligation }],
    });
  };

  const handleObligationChange = (index: number, obligation: Obligation) => {
    const obligations = [...(group.obligations || [])];
    obligations[index] = obligation;
    onChange({ ...group, obligations });
  };

  const handleDeleteObligation = (index: number) => {
    const obligations = (group.obligations || []).filter((_, i) => i !== index);
    onChange({ ...group, obligations });
  };

  // Market Maker Obligation handlers
  const handleAddMarketMakerObligation = () => {
    onChange({
      ...group,
      marketMakerObligations: [
        ...(group.marketMakerObligations || []),
        { ...defaultMarketMakerObligation },
      ],
    });
  };

  const handleMarketMakerObligationChange = (
    index: number,
    obligation: MarketMakerObligation
  ) => {
    const marketMakerObligations = [...(group.marketMakerObligations || [])];
    marketMakerObligations[index] = obligation;
    onChange({ ...group, marketMakerObligations });
  };

  const handleDeleteMarketMakerObligation = (index: number) => {
    const marketMakerObligations = (group.marketMakerObligations || []).filter(
      (_, i) => i !== index
    );
    onChange({ ...group, marketMakerObligations });
  };

  // Nested Group handlers
  const handleAddNestedGroup = () => {
    onChange({
      ...group,
      groups: [...(group.groups || []), { ...defaultObligationGroup }],
    });
  };

  const handleNestedGroupChange = (index: number, nestedGroup: ObligationGroup) => {
    const groups = [...(group.groups || [])];
    groups[index] = nestedGroup;
    onChange({ ...group, groups });
  };

  const handleDeleteNestedGroup = (index: number) => {
    const groups = (group.groups || []).filter((_, i) => i !== index);
    onChange({ ...group, groups });
  };

  const totalItems =
    (group.obligations?.length || 0) +
    (group.marketMakerObligations?.length || 0) +
    (group.groups?.length || 0);

  // Different border colors for each depth level
  const borderColors = [
    "border-blue-300 dark:border-blue-700",
    "border-purple-300 dark:border-purple-700",
    "border-teal-300 dark:border-teal-700",
    "border-orange-300 dark:border-orange-700",
  ];
  // For nested group wrapper - use parent level color (depth-1) so it matches sibling obligations
  const nestedBorderColor = depth > 0
    ? borderColors[(depth - 1) % borderColors.length]
    : borderColors[0];

  // Combine all items for rendering with separators
  const allItems: { type: "obligation" | "mmObligation" | "group"; index: number }[] = [];
  (group.obligations || []).forEach((_, index) => allItems.push({ type: "obligation", index }));
  (group.marketMakerObligations || []).forEach((_, index) => allItems.push({ type: "mmObligation", index }));
  (group.groups || []).forEach((_, index) => allItems.push({ type: "group", index }));

  // Get border color for current depth (for obligation cards)
  const currentBorderColor = borderColors[depth % borderColors.length];

  // Generate id with parent prefix (1-based numbering)
  const makeId = (index: number) => {
    const num = index + 1;
    return parentId ? `${parentId}-${num}` : `${num}`;
  };

  const renderItem = (item: { type: "obligation" | "mmObligation" | "group"; index: number }, itemIndex: number) => {
    const itemId = makeId(itemIndex);

    if (item.type === "obligation") {
      return (
        <ObligationEditor
          key={itemId}
          obligation={group.obligations![item.index]}
          onChange={(updated) => handleObligationChange(item.index, updated)}
          onDelete={() => handleDeleteObligation(item.index)}
          displayId={itemId}
          productGroupNames={productGroupNames}
          borderColor={currentBorderColor}
        />
      );
    }
    if (item.type === "mmObligation") {
      return (
        <MarketMakerObligationEditor
          key={itemId}
          obligation={group.marketMakerObligations![item.index]}
          onChange={(updated) => handleMarketMakerObligationChange(item.index, updated)}
          onDelete={() => handleDeleteMarketMakerObligation(item.index)}
          displayId={itemId}
          borderColor={currentBorderColor}
        />
      );
    }
    return (
      <ObligationGroupEditor
        key={itemId}
        group={group.groups![item.index]}
        onChange={(updated) => handleNestedGroupChange(item.index, updated)}
        onDelete={() => handleDeleteNestedGroup(item.index)}
        depth={depth + 1}
        label={`Obligation ${itemId} (Group)`}
        productGroupNames={productGroupNames}
        isMarketMakerScheme={isMarketMakerScheme}
        parentId={itemId}
      />
    );
  };

  const Separator = () => (
    <div className="flex items-center justify-center py-3">
      <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 uppercase">
        {group.type}
      </span>
      <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
    </div>
  );

  const content = (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {depth > 0 && <span className="text-sm font-medium">{label}</span>}
          <Select
            size="sm"
            className="w-24"
            aria-label="Group Type"
            selectedKeys={[group.type]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as "AND" | "OR";
              handleTypeChange(selected);
            }}
            disableAnimation
          >
            {obligationGroupTypeOptions.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
          <span className="text-xs text-gray-500">
            ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </span>
        </div>
        {onDelete && (
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            onPress={onDelete}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div>
        {/* All Items with Separators */}
        {allItems.length > 0 && (
          <div>
            {allItems.map((item, idx) => (
              <div key={makeId(idx)}>
                {renderItem(item, idx)}
                {idx < allItems.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {totalItems === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No obligations added. Add {isMarketMakerScheme ? "market maker obligations" : "obligations"} or nested groups.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4">
          {!isMarketMakerScheme && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={handleAddObligation}
            >
              Add Obligation
            </Button>
          )}
          {isMarketMakerScheme && (
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={handleAddMarketMakerObligation}
            >
              Add MM Obligation
            </Button>
          )}
          {depth < 3 && (
            <Button
              size="sm"
              variant="flat"
              color="default"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={handleAddNestedGroup}
            >
              Add Nested Group
            </Button>
          )}
        </div>
      </div>
    </>
  );

  // First level: no border/padding
  if (depth === 0) {
    return <div>{content}</div>;
  }

  // Nested levels: with border and padding
  return (
    <Card className={`border-2 ${nestedBorderColor} shadow-none`}>
      <CardBody className="p-4">
        {content}
      </CardBody>
    </Card>
  );
}
