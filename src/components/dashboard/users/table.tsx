import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { IUser } from "@/lib/interface"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export type DashboardTableProps = {
  data: IUser[]
}

export function UserDashboardTable(props: DashboardTableProps) {
  return (
    <Card>
      <CardContent className="pt-3">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              props.data.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.id}</TableCell>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell className="font-medium">{key.email}</TableCell>
                  <TableCell className="font-medium">
                    <Button asChild color="primary" size="sm">
                      <Link href={`/users/${key.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
