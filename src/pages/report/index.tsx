import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { themeAlpine, colorSchemeDark } from "ag-grid-community";
import { Button, Tooltip } from "@heroui/react";
import { ArrowDownTrayIcon, EyeIcon } from "@heroicons/react/24/outline";

interface Report {
  id: string;
  name: string;
  period: string;
  generatedDate: string;
  type: string;
  status: string;
  format: string;
}

const reports: Report[] = [
  {
    id: "RPT001",
    name: "Monthly Billing Summary",
    period: "November 2024",
    generatedDate: "2024-12-01",
    type: "Summary",
    status: "Ready",
    format: "PDF",
  },
  {
    id: "RPT002",
    name: "Member Billing Details",
    period: "November 2024",
    generatedDate: "2024-12-01",
    type: "Detailed",
    status: "Ready",
    format: "Excel",
  },
  {
    id: "RPT003",
    name: "Scheme Performance Report",
    period: "Q3 2024",
    generatedDate: "2024-10-05",
    type: "Analytics",
    status: "Ready",
    format: "PDF",
  },
  {
    id: "RPT004",
    name: "Year-to-Date Billing Analysis",
    period: "2024 YTD",
    generatedDate: "2024-12-01",
    type: "Analytics",
    status: "Processing",
    format: "PDF",
  },
  {
    id: "RPT005",
    name: "Regulatory Compliance Report",
    period: "November 2024",
    generatedDate: "2024-12-02",
    type: "Compliance",
    status: "Ready",
    format: "PDF",
  },
];

export default function ReportPage() {
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const gridTheme = resolvedTheme === "dark" ? themeAlpine.withPart(colorSchemeDark) : themeAlpine;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Ready":
        return "px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300";
      case "Processing":
        return "px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300";
      case "Failed":
        return "px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300";
      default:
        return "px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getFormatStyle = () => {
    return "px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  const StatusCellRenderer = useCallback((params: ICellRendererParams<Report>) => {
    const status = params.value as string;
    return <span className={getStatusStyle(status)}>{status}</span>;
  }, []);

  const FormatCellRenderer = useCallback((params: ICellRendererParams<Report>) => {
    return <span className={getFormatStyle()}>{params.value}</span>;
  }, []);

  const ActionsCellRenderer = useCallback((params: ICellRendererParams<Report>) => {
    const data = params.data;
    if (!data) return null;
    const isReady = data.status === "Ready";
    return (
      <div className="h-full flex items-center gap-2">
        <Tooltip content="Download" delay={1000}>
          <Button isIconOnly size="sm" variant="flat" color="primary" isDisabled={!isReady}>
            <ArrowDownTrayIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
        <Tooltip content="View" delay={1000}>
          <Button isIconOnly size="sm" variant="flat" color="default">
            <EyeIcon className="w-4 h-4" />
          </Button>
        </Tooltip>
      </div>
    );
  }, []);

  const columnDefs = useMemo<ColDef<Report>[]>(() => [
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
    { field: "id", headerName: "Report ID", filter: true, sortable: true, width: 110 },
    { field: "name", headerName: "Name", filter: true, sortable: true, flex: 1 },
    { field: "period", headerName: "Period", filter: true, sortable: true, width: 140 },
    { field: "type", headerName: "Type", filter: true, sortable: true, width: 120 },
    { field: "generatedDate", headerName: "Generated", filter: true, sortable: true, width: 120 },
    { field: "format", headerName: "Format", cellRenderer: FormatCellRenderer, filter: true, sortable: true, width: 100 },
    { field: "status", headerName: "Status", cellRenderer: StatusCellRenderer, filter: true, sortable: true, width: 120 },
  ], [ActionsCellRenderer, StatusCellRenderer, FormatCellRenderer]);

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 1,
    minWidth: 80,
    resizable: true,
  }), []);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Billing Reports</h1>
          <p className="text-gray-500 text-sm">Generate, view, and download billing reports for analysis and compliance.</p>
        </div>
        <Button color="primary">Generate Report</Button>
      </div>
      {isClient && (
        <div className="flex-1 overflow-hidden">
          <AgGridReact<Report>
            theme={gridTheme}
            rowData={reports}
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
