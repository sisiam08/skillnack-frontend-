import { ParamsProps } from "@/types";
import Class from "../../_component/Class";
import { UserService } from "@/service/user.service";

export default async function ClassPage({ params }: ParamsProps) {
  const session = await UserService.getSession();

  if (session.error || !session.data) {
    return <div className="p-4">You can not access this class.</div>;
  }
  const { id, name } = session.data.user;

  const { classID } = await params;
  return <Class classID={classID!} userID={id} userName={name} />;
}
