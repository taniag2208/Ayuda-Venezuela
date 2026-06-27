import type { Metadata } from "next";
import { MessageCircle, Shield, Info } from "lucide-react";
import { Header } from "@/components/layout/header";
import { AiChat } from "@/components/chat/ai-chat";
import disasterConfig from "@/lib/disaster-config";

export const metadata: Metadata = { title: "Asistente IA" };

export default function ChatPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col mx-auto w-full max-w-2xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950">
            <MessageCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Asistente de Emergencia IA
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Solo información verificada · Impulsado por Claude
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 mb-4 flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-200">
            Este asistente proporciona información general. Para emergencias activas o rescates,
            llama al <strong>171</strong> inmediatamente.
          </p>
        </div>

        {/* Chat */}
        <div className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 min-h-[500px] flex flex-col">
          <AiChat />
        </div>

        {/* Sources */}
        <div className="mt-3 text-xs text-gray-400 text-center">
          Fuentes: {disasterConfig.officialSources.slice(0, 3).map((s) => s.name).join(" · ")}
        </div>
      </main>
    </>
  );
}
