import { ParamsProps } from "@/types";
import Class from "../../_component/Class";

export default async function ClassPage({ params }: ParamsProps) {
  const { classID } = await params;
  return <Class classID={classID!} />;
}
