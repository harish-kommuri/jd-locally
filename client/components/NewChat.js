"use client";

import PromptInput from "./PromptInput";

export default function NewChat({
  isLoading = false,
  onPrompted = () => {}
}) {
  return (
    <main className="flex w-full items-center justify-center px-6 py-10 sm:px-10 bg-[radial-gradient(circle_at_top,rgba(0,118,215,0.08),transparent_60%)]">
      <div className="max-w-[520px] w-full text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Locally</h2>
        <p className="mt-3 text-sm text-slate-500">
          Start a conversation to see messages here.
        </p>
        <PromptInput disabled={isLoading} onSubmit={onPrompted} />
      </div>
    </main>
  );
}
