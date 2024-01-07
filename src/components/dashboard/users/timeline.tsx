'use client'

import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { ResponsiveContainer } from 'recharts';

export type UserTimelineChartProps = {
  data: any;
}

export default function UserTimelineChart(props: UserTimelineChartProps) {

  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <Gantt
          tasks={props.data}
          viewMode={ViewMode.Hour}
        />
      </ResponsiveContainer>
    </>
  );


}