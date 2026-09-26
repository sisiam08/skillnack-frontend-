import ClassDynamic from "../../_component/ClassDynamic";
import { UserService } from "@/service/user.service";
import { BookingService } from "@/service/booking.service";

type ClassPageProps = {
  params: Promise<{ classID: string }>;
  searchParams: Promise<{ bookingId?: string }>;
};

export default async function ClassPage({ params, searchParams }: ClassPageProps) {
  const session = await UserService.getSession();

  if (session.error || !session.data) {
    return <div className="p-4">You can not access this class.</div>;
  }
  const { id, name } = session.data.user;

  const { classID } = await params;
  const { bookingId } = await searchParams;

  let requestInfo: {
    title?: string | null;
    description?: string | null;
    attachments?: string[];
  } | null = null;

  if (bookingId) {
    const info = await BookingService.getBookingRequestInfo(bookingId);
    requestInfo = info.data;
  }

  return (
    <ClassDynamic
      classID={classID!}
      userID={id}
      userName={name}
      bookingId={bookingId}
      requestTitle={requestInfo?.title}
      requestDescription={requestInfo?.description}
      initialAttachments={requestInfo?.attachments ?? []}
    />
  );
}
