import { Globe } from "lucide-react";

export type DashboardListProps = {
  data: Record<string, any>[];
  titleKey: string;
  descriptionKey?: string;
  valueKey: string;
}


export function DashboardList(props: DashboardListProps) {
  return (
    <div className="space-y-5">

      {
        props.data.map((item, index) => (
          <div key={index} className="flex items-center">
              <Globe size={24} />
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {item[props.titleKey]}
              </p>
              {props.descriptionKey &&
                <p className="text-sm text-muted-foreground">
                  {
                    item[props.descriptionKey]}
                </p>
              }
            </div>
            <div className="ml-auto font-medium">
              {item[props.valueKey]}
            </div>
          </div>
        ))
      }
    </div>
  )
}