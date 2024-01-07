import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type DashboardCardProps = {
  title: string;
  icon?: React.ReactNode;
  content: string | number;
  footer?: string;
}


export default function DashboardCard(props: DashboardCardProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {props.title}
          </CardTitle>
          {
            props.icon &&
            (props.icon)
          }
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {props.content}
          </div>
          {props.footer && <p className="text-xs text-muted-foreground">
            {props.footer}
          </p>}
        </CardContent>
      </Card>

    </>
  )
}