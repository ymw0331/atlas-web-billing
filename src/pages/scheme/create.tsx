import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  DatePicker,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Switch,
} from "@heroui/react";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { parseDate } from "@internationalized/date";
import ProductFilterDialog from "@/components/scheme/product-filter-dialog";
import IncentiveDialog from "@/components/scheme/incentive-dialog";
import {
  SchemeFormData,
  ProductFilter,
  Incentive,
  Obligation,
  MarketMakerObligation,
  ObligationGroup,
  defaultSchemeFormValues,
  billingPeriodOptions,
  billingTypeOptions,
  payoutTypeOptions,
} from "@/types/scheme";

export default function CreateSchemePage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<SchemeFormData>({
    defaultValues: defaultSchemeFormValues,
  });

  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productDialogType, setProductDialogType] = useState<"billing" | "support">("billing");
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);

  const [incentiveDialogOpen, setIncentiveDialogOpen] = useState(false);
  const [editingIncentiveIndex, setEditingIncentiveIndex] = useState<number | null>(null);

  // Watch values
  const billingProducts = watch("billingProducts") || [];
  const supportProducts = watch("supportProducts") || [];
  const incentives = watch("incentives") || [];
  const isMarketMakerScheme = watch("isMarketMakerScheme");

  // Get product group names
  const billingProductGroupNames = billingProducts
    .map((p) => p.filterName)
    .filter((name) => name);

  const allProductGroupNames = [
    ...billingProductGroupNames,
    ...supportProducts.map((p) => p.filterName),
  ].filter((name) => name);

  // Product Filter handlers
  const openProductDialog = (type: "billing" | "support", index?: number) => {
    setProductDialogType(type);
    setEditingProductIndex(index ?? null);
    setProductDialogOpen(true);
  };

  const handleSaveProductFilter = (filter: ProductFilter) => {
    const field = productDialogType === "billing" ? "billingProducts" : "supportProducts";
    const products = productDialogType === "billing" ? billingProducts : supportProducts;

    if (editingProductIndex !== null) {
      const updated = [...products];
      updated[editingProductIndex] = filter;
      setValue(field, updated);
    } else {
      setValue(field, [...products, filter]);
    }
  };

  const handleDeleteProduct = (type: "billing" | "support", index: number) => {
    const field = type === "billing" ? "billingProducts" : "supportProducts";
    const products = type === "billing" ? billingProducts : supportProducts;
    setValue(field, products.filter((_, i) => i !== index));
  };

  // Incentive handlers
  const openIncentiveDialog = (index?: number) => {
    setEditingIncentiveIndex(index ?? null);
    setIncentiveDialogOpen(true);
  };

  const handleSaveIncentive = (incentive: Incentive) => {
    if (editingIncentiveIndex !== null) {
      const updated = [...incentives];
      updated[editingIncentiveIndex] = incentive;
      setValue("incentives", updated);
    } else {
      setValue("incentives", [...incentives, incentive]);
    }
  };

  const handleDeleteIncentive = (index: number) => {
    setValue("incentives", incentives.filter((_, i) => i !== index));
  };

  const onSubmit = (data: SchemeFormData) => {
    console.log("Form submitted:", data);
  };

  const getEditingProduct = () => {
    if (editingProductIndex === null) return undefined;
    return productDialogType === "billing"
      ? billingProducts[editingProductIndex]
      : supportProducts[editingProductIndex];
  };

  const getEditingIncentive = () => {
    if (editingIncentiveIndex === null) return undefined;
    return incentives[editingIncentiveIndex];
  };

  // Generate summary parts for a single obligation
  const getObligationSummaryParts = (obligation: Obligation) => {
    const groups = obligation.applicableProductGroupNames?.length
      ? obligation.applicableProductGroupNames
      : ["All"];

    const textParts: string[] = [];
    if (obligation.obligationType) {
      const unitText = obligation.valueUnit ? ` (${obligation.valueUnit})` : "";
      textParts.push(`by ${obligation.obligationType}${unitText}`);
    }
    if (obligation.valueType && obligation.valueFrom !== undefined) {
      const valueTypeLabel = obligation.valueType === "GreaterThan" ? "Greater Than" : "Range";
      const valueText = obligation.valueType === "GreaterThan"
        ? `${valueTypeLabel} ${obligation.valueFrom}`
        : `${valueTypeLabel} ${obligation.valueFrom}${obligation.valueTo !== undefined ? ` ~ ${obligation.valueTo}` : ""}`;
      textParts.push(valueText);
    }
    return { groups, text: textParts.join(" ") };
  };

  // Generate summary parts for a market maker obligation
  const getMMObligationSummaryParts = (obligation: MarketMakerObligation) => {
    const parts: string[] = [];
    parts.push(`${obligation.timeRange.startTime} - ${obligation.timeRange.endTime}`);
    if (obligation.minQuoteTimePercentage) {
      parts.push(`Min Quote Time ${obligation.minQuoteTimePercentage}%`);
    }
    if (obligation.minSizeInLotsOnEachSide) {
      parts.push(`Min Size ${obligation.minSizeInLotsOnEachSide} lots`);
    }

    const tiers = (obligation.obligationTiers || []).map((tier, idx) => {
      const valueTypeLabel = tier.valueType === "GreaterThan" ? ">" : "";
      const valueText = tier.valueType === "GreaterThan"
        ? `${valueTypeLabel} ${tier.valueFrom}`
        : `${tier.valueFrom} ~ ${tier.valueTo}`;
      return `Tier ${idx + 1}: Spread ${tier.spread}, ${valueText} ${tier.valueUnit}`;
    });

    return { summary: parts.join(", "), tiers };
  };

  // Collect all obligation summaries from a group (recursive)
  type SummaryItem = {
    id: string;
    summary: string;
    productGroups?: string[];
    tiers?: string[];
    type: "obligation" | "mmObligation" | "groupStart" | "groupEnd";
    groupType: "AND" | "OR";
    parentGroupType?: "AND" | "OR";
    depth: number;
    isFirst: boolean;
  };

  const collectObligationSummaries = (
    group: ObligationGroup,
    prefix: string = "",
    depth: number = 0,
    parentGroupType?: "AND" | "OR"
  ): SummaryItem[] => {
    const summaries: SummaryItem[] = [];
    const allItems: { type: "obligation" | "mmObligation" | "group"; data: Obligation | MarketMakerObligation | ObligationGroup }[] = [];

    // Collect all items in order
    (group.obligations || []).forEach((obl) => allItems.push({ type: "obligation", data: obl }));
    (group.marketMakerObligations || []).forEach((obl) => allItems.push({ type: "mmObligation", data: obl }));
    (group.groups || []).forEach((g) => allItems.push({ type: "group", data: g }));

    allItems.forEach((item, itemIndex) => {
      const id = prefix ? `${prefix}-${itemIndex + 1}` : `${itemIndex + 1}`;
      const isFirst = itemIndex === 0;

      if (item.type === "obligation") {
        const { groups, text } = getObligationSummaryParts(item.data as Obligation);
        summaries.push({
          id,
          summary: text,
          productGroups: groups,
          type: "obligation",
          groupType: group.type,
          parentGroupType,
          depth,
          isFirst
        });
      } else if (item.type === "mmObligation") {
        const { summary, tiers } = getMMObligationSummaryParts(item.data as MarketMakerObligation);
        summaries.push({
          id,
          summary,
          tiers,
          type: "mmObligation",
          groupType: group.type,
          parentGroupType,
          depth,
          isFirst
        });
      } else {
        const nestedGroup = item.data as ObligationGroup;
        // Add group start marker
        summaries.push({
          id,
          summary: "",
          type: "groupStart",
          groupType: nestedGroup.type,
          parentGroupType: group.type,
          depth,
          isFirst
        });
        // Add nested items
        const nestedSummaries = collectObligationSummaries(nestedGroup, id, depth + 1, group.type);
        summaries.push(...nestedSummaries);
        // Add group end marker
        summaries.push({
          id: `${id}-end`,
          summary: "",
          type: "groupEnd",
          groupType: nestedGroup.type,
          parentGroupType: group.type,
          depth,
          isFirst: false
        });
      }
    });

    return summaries;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Scheme</h1>
          <p className="text-gray-500 text-sm">
            Configure a new billing scheme with the required details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Scheme Details */}
            <Card className="shadow-none border border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gray-50 dark:bg-gray-800">
                <div>
                  <h3 className="text-lg font-semibold">Scheme Details</h3>
                  <p className="text-sm text-gray-500">
                    Basic information, billing configuration, and payout settings
                  </p>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Scheme name is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Scheme Name"
                        labelPlacement="outside"
                        placeholder="Enter scheme name"
                        isRequired
                        isInvalid={!!errors.name}
                        errorMessage={errors.name?.message}
                      />
                    )}
                  />

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        value={field.value || ""}
                        label="Description"
                        labelPlacement="outside"
                        placeholder="Enter scheme description"
                        minRows={3}
                      />
                    )}
                  />

                  <Controller
                    name="isMarketMakerScheme"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        Market Maker Scheme
                      </Switch>
                    )}
                  />
                </div>

                {/* Billing & Payout Config */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Controller
                    name="billingPeriod"
                    control={control}
                    rules={{ required: "Billing period is required" }}
                    render={({ field }) => (
                      <Select
                        label="Billing Period"
                        labelPlacement="outside"
                        placeholder="Select billing period"
                        isRequired
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected);
                        }}
                        isInvalid={!!errors.billingPeriod}
                        errorMessage={errors.billingPeriod?.message}
                      >
                        {billingPeriodOptions.map((option) => (
                          <SelectItem key={option.value}>{option.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Controller
                    name="billingType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Billing Type"
                        labelPlacement="outside"
                        placeholder="Select billing type"
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected || undefined);
                        }}
                      >
                        {billingTypeOptions.map((option) => (
                          <SelectItem key={option.value}>{option.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Controller
                    name="payoutType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Payout Type"
                        labelPlacement="outside"
                        placeholder="Select payout type"
                        selectedKeys={field.value ? [field.value] : []}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          field.onChange(selected || undefined);
                        }}
                      >
                        {payoutTypeOptions.map((option) => (
                          <SelectItem key={option.value}>{option.label}</SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  <Controller
                    name="payoutCap"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        label="Payout Cap"
                        labelPlacement="outside"
                        placeholder="Enter payout cap"
                        value={field.value?.toString() || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : undefined);
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="expiresAt"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Expiry Date"
                        labelPlacement="outside"
                        value={
                          field.value
                            ? parseDate(field.value.toISOString().split("T")[0])
                            : null
                        }
                        onChange={(date) => {
                          field.onChange(date ? new Date(date.toString()) : null);
                        }}
                      />
                    )}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Products */}
            <Card className="shadow-none border border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gray-50 dark:bg-gray-800">
                <div>
                  <h3 className="text-lg font-semibold">Products</h3>
                  <p className="text-sm text-gray-500">
                    {billingProducts.length} billing, {supportProducts.length} support
                  </p>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Billing Products */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-sm font-medium">Billing Products</h4>
                      <p className="text-xs text-gray-500">Trades will be billingd for incentive, clearing fee etc.</p>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<PlusIcon className="w-4 h-4" />}
                      onPress={() => openProductDialog("billing")}
                    >
                      Add
                    </Button>
                  </div>
                  {billingProducts.length === 0 ? (
                    <p className="text-sm text-gray-500">No billing product filters added.</p>
                  ) : (
                    <div className="space-y-2">
                      {billingProducts.map((filter, index) => (
                        <Card key={index} className="shadow-none border border-gray-200 dark:border-gray-700">
                          <CardBody className="p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-medium text-sm">{filter.filterName}</p>
                                  <p className="text-xs text-gray-500">
                                    {filter.assetClass} | {filter.productCodes.length} products
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="primary"
                                  onPress={() => openProductDialog("billing", index)}
                                >
                                  <PencilSquareIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  onPress={() => handleDeleteProduct("billing", index)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Support Products */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="text-sm font-medium">Support Products</h4>
                      <p className="text-xs text-gray-500">Only used for obligation calculation, won't be included for billing</p>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<PlusIcon className="w-4 h-4" />}
                      onPress={() => openProductDialog("support")}
                    >
                      Add
                    </Button>
                  </div>
                  {supportProducts.length === 0 ? (
                    <p className="text-sm text-gray-500">No support product filters added.</p>
                  ) : (
                    <div className="space-y-2">
                      {supportProducts.map((filter, index) => (
                        <Card key={index} className="shadow-none border border-gray-200 dark:border-gray-700">
                          <CardBody className="p-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className="font-medium text-sm">{filter.filterName}</p>
                                  <p className="text-xs text-gray-500">
                                    {filter.assetClass} | {filter.productCodes.length} products
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="primary"
                                  onPress={() => openProductDialog("support", index)}
                                >
                                  <PencilSquareIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  onPress={() => handleDeleteProduct("support", index)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Incentives */}
            <Card className="shadow-none border border-gray-200 dark:border-gray-700">
              <CardHeader className="bg-gray-50 dark:bg-gray-800">
                <div>
                  <h3 className="text-lg font-semibold">Incentives</h3>
                  <p className="text-sm text-gray-500">
                    {incentives.length} incentive{incentives.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </CardHeader>
              <CardBody>
                {incentives.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-4">No incentives added yet.</p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {incentives.map((incentive, index) => {
                      const obligationSummaries = collectObligationSummaries(incentive.obligations);
                      return (
                        <Card key={index} className="shadow-none border border-gray-200 dark:border-gray-700">
                          <CardBody className="p-4">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">
                                {incentive.payoutRate} {incentive.payoutUnit}
                                {incentive.applicableProductGroupNames &&
                                  incentive.applicableProductGroupNames.length > 0 && (
                                    <span className="text-gray-500 font-normal">
                                      {" "}for {incentive.applicableProductGroupNames.join(", ")}
                                    </span>
                                  )}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="flat"
                                  color="primary"
                                  onPress={() => openIncentiveDialog(index)}
                                >
                                  <PencilSquareIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="flat"
                                  color="danger"
                                  onPress={() => handleDeleteIncentive(index)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {/* Obligation Summaries */}
                            {obligationSummaries.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="space-y-1">
                                  {obligationSummaries.map(({ id, summary, productGroups, tiers, type, groupType, parentGroupType, depth, isFirst }) => {
                                    const indent = depth * 16;

                                    if (type === "groupStart") {
                                      return (
                                        <p key={id} className="text-xs text-gray-500" style={{ paddingLeft: indent }}>
                                          {!isFirst && (
                                            <span className="font-medium text-gray-600 dark:text-gray-400">
                                              {parentGroupType}{" "}
                                            </span>
                                          )}
                                          <span className="font-medium text-gray-600 dark:text-gray-400">(</span>
                                        </p>
                                      );
                                    }

                                    if (type === "groupEnd") {
                                      return (
                                        <p key={id} className="text-xs text-gray-500" style={{ paddingLeft: indent }}>
                                          <span className="font-medium text-gray-600 dark:text-gray-400">)</span>
                                        </p>
                                      );
                                    }

                                    return (
                                      <div key={id} style={{ paddingLeft: indent }}>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                          {!isFirst && (
                                            <span className="font-medium text-gray-600 dark:text-gray-400">
                                              {groupType}{" "}
                                            </span>
                                          )}
                                          {type === "mmObligation" && (
                                            <span className="font-medium text-gray-600 dark:text-gray-400">MM: </span>
                                          )}
                                          {type === "obligation" && productGroups && (
                                            <>
                                              <span>if</span>
                                              {productGroups.map((group) => (
                                                <Chip key={group} size="sm" variant="flat" color="default" className="h-5 text-xs">
                                                  {group}
                                                </Chip>
                                              ))}
                                            </>
                                          )}
                                          <span>{summary}</span>
                                        </div>
                                        {tiers && tiers.length > 0 && (
                                          <div className="mt-1 space-y-0.5" style={{ paddingLeft: 16 }}>
                                            {tiers.map((tier, idx) => (
                                              <p key={idx} className="text-xs text-gray-400">
                                                {tier}
                                              </p>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      );
                    })}
                  </div>
                )}
                <div className="flex justify-end">
                  <Button
                    variant="flat"
                    color="primary"
                    startContent={<PlusIcon className="w-4 h-4" />}
                    onPress={() => openIncentiveDialog()}
                  >
                    Add Incentive
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="flat" color="default" onPress={() => reset()}>
              Reset
            </Button>
            <Button type="submit" color="primary" isLoading={isSubmitting}>
              Create Scheme
            </Button>
          </div>
        </form>

        {/* Dialogs */}
        <ProductFilterDialog
          isOpen={productDialogOpen}
          onClose={() => {
            setProductDialogOpen(false);
            setEditingProductIndex(null);
          }}
          onSave={handleSaveProductFilter}
          initialData={getEditingProduct()}
          title={
            editingProductIndex !== null
              ? "Edit Product Filter"
              : "Add Product Filter"
          }
        />

        <IncentiveDialog
          isOpen={incentiveDialogOpen}
          onClose={() => {
            setIncentiveDialogOpen(false);
            setEditingIncentiveIndex(null);
          }}
          onSave={handleSaveIncentive}
          initialData={getEditingIncentive()}
          title={editingIncentiveIndex !== null ? "Edit Incentive" : "Add Incentive"}
          billingProductGroupNames={billingProductGroupNames}
          allProductGroupNames={allProductGroupNames}
          isMarketMakerScheme={isMarketMakerScheme}
        />
      </div>
    </div>
  );
}
