'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";


import ReactJson from "@microlink/react-json-view";

const DevLog = (props: {
  title: string;
  data: object | undefined;
}) => {

  console.log(props.data);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="absolute z-50 top-2 right-16"
          variant="outline"
        > View JSON </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle> JSON viewer </DialogTitle>
          <DialogDescription>
            View the JSON logs from the server
          </DialogDescription>
        </DialogHeader>
        <>

          {props.data &&
            <ReactJson
              src={props.data}
              collapsed={true}
              displayDataTypes={false}
            />
          }

          <Separator />
        </>

      </DialogContent>
    </Dialog>)
}


export default DevLog;