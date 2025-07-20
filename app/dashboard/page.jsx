import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8">Welcome to Chatify Dashboard</h1>
      <div className="w-full max-w-md flex flex-col gap-6">
        <CreateRoomForm />
        <JoinRoomForm />
      </div>
    </main>
  );
}