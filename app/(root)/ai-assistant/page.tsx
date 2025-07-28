import AIChat from "@/components/ai/AIChat";

export const metadata = {
  title: "AI Assistant - ModernShop",
  description:
    "Get personalized shopping assistance with our AI-powered chatbot.",
};

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Your Personal AI Shopping Assistant
        </h1>
        <AIChat />
      </main>
    </div>
  );
}
