import { ChatList } from "@/components/admin/ChatList";
import { listEnquiries, listEnquiryChats } from "@/lib/store/enquiries";

export default async function ChatsPage() {
  const chats = listEnquiryChats(await listEnquiries());

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-[1.7rem] font-semibold text-navy">Chats</h1>
      <p className="mt-1 text-body">Tap a person to read the thread and reply.</p>
      <div className="mt-5">
        <ChatList
          items={chats.map((enquiry) => {
            const last = enquiry.messages?.at(-1);
            return {
              id: enquiry.id,
              name: enquiry.fullName,
              phone: enquiry.phone,
              preview: last?.text ?? enquiry.message,
              at: last?.at ?? enquiry.receivedAt,
              fromStaff: last?.from === "staff",
              waiting: !last || last.from === "customer",
            };
          })}
        />
      </div>
    </div>
  );
}
