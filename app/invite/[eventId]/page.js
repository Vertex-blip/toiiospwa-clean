import { InvitePage } from "@/components/PlatformPages";

export default function InviteRoute({ params }) {
  return <InvitePage eventId={params.eventId} />;
}
