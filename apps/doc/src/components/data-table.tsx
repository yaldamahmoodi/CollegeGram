import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  LoaderIcon,
  TrendingUpIcon,
} from "lucide-react"
import { useHealthCheck } from "@/hooks/useHealthCheck"

// System metrics type
type SystemMetrics = {
  id: number;
  service: string;
  status: "healthy" | "warning" | "unhealthy" | "unknown";
  type: "Backend" | "Frontend" | "Database" | "Cache" | "Search" | "Email" | "Container";
  port?: string;
  uptime?: string;
  lastChecked: string;
  details?: string;
}
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const columns: ColumnDef<SystemMetrics>[] = [
  {
    accessorKey: "service",
    header: "Service",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.service}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="px-2 py-1">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      const getStatusColor = (status: string) => {
        switch (status) {
          case "healthy": return "text-green-600 bg-green-50 border-green-200"
          case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200"
          case "unhealthy": return "text-red-600 bg-red-50 border-red-200"
          default: return "text-gray-600 bg-gray-50 border-gray-200"
        }
      }
      
      return (
        <Badge
          variant="outline"
          className={`flex gap-1 px-2 py-1 capitalize ${getStatusColor(status)}`}
        >
          {status === "healthy" ? (
            <CheckCircle2Icon className="size-3" />
          ) : status === "warning" ? (
            <LoaderIcon className="size-3 animate-pulse" />
          ) : (
            <LoaderIcon className="size-3" />
          )}
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "port",
    header: "Port",
    cell: ({ row }) => (
      <div className="text-sm font-mono">
        {row.original.port || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "uptime",
    header: "Uptime",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.uptime || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "lastChecked",
    header: "Last Checked",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {new Date(row.original.lastChecked).toLocaleTimeString()}
      </div>
    ),
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm text-muted-foreground">
        {row.original.details || "No details available"}
      </div>
    ),
  },
]


export function DataTable() {
  const { healthData, systemMetrics, loading } = useHealthCheck(30000)
  
  // Generate system metrics data from health check
  const generateSystemMetrics = React.useMemo((): SystemMetrics[] => {
    const metrics: SystemMetrics[] = []
    
    // Define all expected services with their default configurations
    const expectedServices = [
      { name: 'MongoDB', type: 'Database' as const, defaultPort: '27017' },
      { name: 'Redis', type: 'Cache' as const, defaultPort: '6379' },
      { name: 'Elasticsearch', type: 'Search' as const, defaultPort: '9200' },
      { name: 'Email Service', type: 'Email' as const, defaultPort: '1025' },
      { name: 'Swagger API Docs', type: 'Backend' as const, defaultPort: '3001/api/docs' },
      { name: 'Frontend (React)', type: 'Frontend' as const, defaultPort: '3000-3003' },
      { name: 'Docker Services', type: 'Container' as const, defaultPort: 'N/A' },
      { name: 'System Resources', type: 'Backend' as const, defaultPort: 'N/A' }
    ]
    
    // Process each expected service
    expectedServices.forEach((expectedService, index) => {
      // Find matching service from health check data
      const healthService = healthData?.services?.find(s => s.name === expectedService.name)
      
      if (healthService) {
        // Service found in health check - use real data
        metrics.push({
          id: index + 1,
          service: healthService.name,
          status: healthService.status === 'healthy' ? 'healthy' : 
                  healthService.status === 'warning' ? 'warning' : 'unhealthy',
          type: expectedService.type,
          port: healthService.details?.port || 
                healthService.details?.uri?.split(':').pop()?.split('/')[0] || 
                expectedService.defaultPort,
          uptime: systemMetrics?.system.uptime ? 
                  `${Math.floor(systemMetrics.system.uptime / 3600)}h ${Math.floor((systemMetrics.system.uptime % 3600) / 60)}m` : 'N/A',
          lastChecked: healthService.lastChecked || new Date().toISOString(),
          details: healthService.message || 'No details available'
        })
      } else {
        // Service not found in health check - show as unhealthy
        metrics.push({
          id: index + 1,
          service: expectedService.name,
          status: 'unhealthy',
          type: expectedService.type,
          port: expectedService.defaultPort,
          uptime: 'N/A',
          lastChecked: new Date().toISOString(),
          details: loading ? 'Checking...' : 'Service not responding'
        })
      }
    })
    
    return metrics
  }, [healthData, systemMetrics, loading])
  
  const [data, setData] = React.useState<SystemMetrics[]>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Update data when metrics change
  React.useEffect(() => {
    setData(generateSystemMetrics)
  }, [generateSystemMetrics])


  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })


  if (loading) {
    return (
      <div className="flex w-full flex-col justify-start gap-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <h2 className="text-2xl font-semibold">System Metrics</h2>
        </div>
        <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LoaderIcon className="size-4 animate-spin" />
              Loading system metrics...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <h2 className="text-2xl font-semibold">System Metrics</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <TrendingUpIcon className="size-4" />
            <span className="hidden lg:inline">Refresh</span>
          </Button>
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No system metrics available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

