import React, { useState, useMemo, useCallback, useEffect } from "react";
import NextLink from "next/link";
import { useTheme } from "next-themes";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { themeAlpine, colorSchemeDark } from "ag-grid-community";
import { Button, Tooltip } from "@heroui/react";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface Scheme {
  id: string;
  name: string;
  description?: string;
  billingPeriod: "Monthly" | "Quarterly";
  billingType?: "ClearingFeeBilling" | "Incentive" | "CashSettlementFee";
  payoutCap?: number;
  payoutType?: "SUM" | "MAX" | "TIERED_SUM";
  createdAt: string;
  updatedAt?: string;
  expiresAt?: string;
}

const schemes: Scheme[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Q4 Securities Trading Billing",
    description: "Quarterly billing for high volume securities trading",
    billingPeriod: "Quarterly",
    billingType: "ClearingFeeBilling",
    payoutCap: 50000,
    payoutType: "SUM",
    createdAt: "2024-10-01T10:00:00Z",
    updatedAt: "2024-11-15T14:30:00Z",
    expiresAt: "2025-03-31T23:59:59Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Derivatives Market Maker Program",
    description: "Market maker incentive program for derivatives",
    billingPeriod: "Monthly",
    billingType: "Incentive",
    payoutCap: 100000,
    payoutType: "TIERED_SUM",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-12-01T11:00:00Z",
    expiresAt: "2025-12-31T23:59:59Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "New Member Onboarding Incentive",
    description: "Incentive for new member onboarding",
    billingPeriod: "Quarterly",
    billingType: "Incentive",
    payoutType: "MAX",
    createdAt: "2024-12-01T08:00:00Z",
    expiresAt: "2025-06-30T23:59:59Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "ETF Liquidity Provider Billing",
    description: "Billing program for ETF liquidity providers",
    billingPeriod: "Monthly",
    billingType: "ClearingFeeBilling",
    payoutCap: 25000,
    payoutType: "SUM",
    createdAt: "2024-06-01T10:30:00Z",
    updatedAt: "2024-09-15T16:45:00Z",
    expiresAt: "2025-05-31T23:59:59Z",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Cash Settlement Fee Billing",
    description: "Billing on cash settlement fees",
    billingPeriod: "Monthly",
    billingType: "CashSettlementFee",
    payoutCap: 10000,
    payoutType: "SUM",
    createdAt: "2024-03-01T09:00:00Z",
    updatedAt: "2024-08-20T13:00:00Z",
    expiresAt: "2024-12-31T23:59:59Z",
  },
];

export default function SchemePage() {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const gridTheme = resolvedTheme === "dark" ? themeAlpine.withPart(colorSchemeDark) : themeAlpine;

  const billingTypeLabels: Record<string, string> = {
    ClearingFeeBilling: "Clearing Fee Billing",
    Incentive: "Incentive",
    CashSettlementFee: "Cash Settlement Fee",
  };

  const payoutTypeLabels: Record<string, string> = {
    SUM: "Sum",
    MAX: "Maximum",
    TIERED_SUM: "Tiered Sum",
  };

  const BillingTypeCellRenderer = useCallback((params: ICellRendererParams<Scheme>) => {
    const value = params.value as string;
    return <span>{value ? billingTypeLabels[value] || value : "-"}</span>;
  }, []);

  const PayoutTypeCellRenderer = useCallback((params: ICellRendererParams<Scheme>) => {
    const value = params.value as string;
    return <span>{value ? payoutTypeLabels[value] || value : "-"}</span>;
  }, []);

  const DateCellRenderer = useCallback((params: ICellRendererParams<Scheme>) => {
    const value = params.value as string;
    if (!value) return <span>-</span>;
    return <span>{new Date(value).toLocaleDateString()}</span>;
  }, []);

  const CurrencyCellRenderer = useCallback((params: ICellRendererParams<Scheme>) => {
    const value = params.value as number;
    if (value === undefined || value === null) return <span>-</span>;
    return <span>${value.toLocaleString()}</span>;
  }, []);

  const ActionsCellRenderer = useCallback((params: ICellRendererParams<Scheme>) => {
    const data = params.data;
    if (!data) return null;
    return (
      <div className="h-full flex items-center gap-2">
        <Tooltip content="View" delay={1000}>
          <Button isIconOnly size="sm" variant="flat" color="primary">
            <EyeIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Edit" delay={1000}>
          <Button isIconOnly size="sm" variant="flat" color="warning">
            <PencilSquareIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    );
  }, []);

  const columnDefs = useMemo<ColDef<Scheme>[]>(() => [
    {
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
      width: 120,
      minWidth: 120,
      maxWidth: 120,
      flex: 0,
      resizable: false,
      sortable: false,
      filter: false,
      cellClass: "pt-1",
    },
    { field: "name", headerName: "Name", filter: true, sortable: true, flex: 1, minWidth: 200 },
    { field: "billingPeriod", headerName: "Period", filter: true, sortable: true, width: 110 },
    { field: "billingType", headerName: "Type", cellRenderer: BillingTypeCellRenderer, filter: true, sortable: true, width: 160 },
    { field: "payoutType", headerName: "Payout Type", cellRenderer: PayoutTypeCellRenderer, filter: true, sortable: true, width: 120 },
    { field: "payoutCap", headerName: "Payout Cap", cellRenderer: CurrencyCellRenderer, filter: true, sortable: true, width: 120 },
    { field: "createdAt", headerName: "Created", cellRenderer: DateCellRenderer, filter: true, sortable: true, width: 110 },
    { field: "expiresAt", headerName: "Expires", cellRenderer: DateCellRenderer, filter: true, sortable: true, width: 110 },
  ], [ActionsCellRenderer, BillingTypeCellRenderer, PayoutTypeCellRenderer, DateCellRenderer, CurrencyCellRenderer]);

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 80,
    resizable: true,
  }), []);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Billing Schemes</h1>
          <p className="text-gray-500 text-sm">Manage and configure billing schemes for members and market participants.</p>
        </div>
        <Button as={NextLink} href="/scheme/create" color="primary">
          Create New Scheme
        </Button>
      </div>
      {isClient && (
        <div className="flex-1 overflow-hidden">
          <AgGridReact<Scheme>
            theme={gridTheme}
            rowData={schemes}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            pagination={true}
            paginationPageSize={20}
            enableCellTextSelection={true}
            ensureDomOrder={true}
          />
        </div>
      )}
    </div>
  );
}
