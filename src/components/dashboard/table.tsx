import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "../ui/card"


export type DashboardTableProps = {
  data: Record<string, any>[]
  list: string[]
}

export function DashboardTable(props: DashboardTableProps) {
  return (
    <Card>
      <CardContent className="pt-3">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              {
                props.list.map((record, index) => (
                  <TableHead key={index}>{record}</TableHead>
                ))
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.data.map((record, index) => (
              <TableRow key={index}>
                {
                  props.list.map((key, index) => (
                    <TableCell key={record.id + index} className="font-medium">{record[key]}</TableCell>
                  ))
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
