import LocallyChatArea from "./LocallyChatArea";
import LocallySidebar from "./LocallySidebar";

export default function LocallyView() {
  return (
    <section className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-[320px_1fr]">
      <LocallySidebar />
      <LocallyChatArea />
    </section>
  );
}
