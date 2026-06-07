import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { themeAlpine, colorSchemeDark } from "ag-grid-community";
import { Button, Tooltip } from "@heroui/react";
import { EyeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface Calculation {
  id: string;
  member: string;
  scheme: string;
  period: string;
  volume: string;
  billingAmount: string;
  status: string;
}

const calculations: Calculation[] = [
  {
    id: "CAL001",
    member: "ABC Securities Pte Ltd",
    scheme: "Securities Trading Billing",
    period: "2024-11",
    volume: "$125,000,000",
    billingAmount: "$12,500",
    status: "Calculated",
  },
  {
    id: "CAL002",
    member: "XYZ Trading Co",
    scheme: "Derivatives Market Maker",
    period: "2024-11",
    volume: "$89,500,000",
    billingAmount: "$8,950",
    status: "Pending Review",
  },
  {
    id: "CAL003",
    member: "Global Investments Ltd",
    scheme: "ETF Liquidity Provider",
    period: "2024-11",
    volume: "$250,000,000",
    billingAmount: "$25,000",
    status: "Approved",
  },
  {
    id: "CAL004",
    member: "Prime Brokers Asia",
    scheme: "Securities Trading Billing",
    period: "2024-11",
    volume: "$78,200,000",
    billingAmount: "$7,820",
    status: "Calculated",
  },
  {
    id: "CAL005",
    member: "Delta Capital Markets",
    scheme: "New Member Incentive",
    period: "2024-11",
    volume: "$45,000,000",
    billingAmount: "$4,500",
    status: "Pending",
  },
];

export default function CalculationPage() {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const gridTheme = resolvedTheme === "dark" ? themeAlpine.withPart(colorSchemeDark) : themeAlpine;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return "px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300";
      case "Calculated":
        return "px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300";
      case "Pending Review":
        return "px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300";
      case "Pending":
        return "px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const StatusCellRenderer = useCallback((params: ICellRendererParams<Calculation>) => {
    const status = params.value as string;
    return <span className={getStatusStyle(status)}>{status}</span>;
  }, []);

  const BillingAmountCellRenderer = useCallback((params: ICellRendererParams<Calculation>) => {
    return <span className="font-semibold">{params.value}</span>;
  }, []);

  const ActionsCellRenderer = useCallback((params: ICellRendererParams<Calculation>) => {
    const data = params.data;
    if (!data) return null;
    return (
      <div className="h-full flex items-center gap-2">
        <Tooltip content="Details" delay={1000}>
          <Button isIconOnly size="sm" variant="flat" color="primary">
            <EyeIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Approve" delay={1000}>
          <Button isIconOnly size="sm" variant="flat" color="success">
            <CheckCircleIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    );
  }, []);

  const columnDefs = useMemo<ColDef<Calculation>[]>(() => [
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
    { field: "id", headerName: "Calc ID", filter: true, sortable: true, width: 100 },
    { field: "member", headerName: "Member", filter: true, sortable: true, flex: 1 },
    { field: "scheme", headerName: "Scheme", filter: true, sortable: true, flex: 1 },
    { field: "period", headerName: "Period", filter: true, sortable: true, width: 100 },
    { field: "volume", headerName: "Trading Volume", filter: true, sortable: true, width: 140 },
    { field: "billingAmount", headerName: "Billing Amount", cellRenderer: BillingAmountCellRenderer, filter: true, sortable: true, width: 140 },
    { field: "status", headerName: "Status", cellRenderer: StatusCellRenderer, filter: true, sortable: true, width: 130 },
  ], [ActionsCellRenderer, StatusCellRenderer, BillingAmountCellRenderer]);

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 80,
    resizable: true,
  }), []);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Billing Calculations</h1>
          <p className="text-gray-500 text-sm">Calculate and review billing amounts for members based on trading activity.</p>
        </div>
        <Button color="primary">Run Calculation</Button>
      </div>
      {isClient && (
        <div className="flex-1 overflow-hidden">
          <AgGridReact<Calculation>
            theme={gridTheme}
            rowData={calculations}
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
