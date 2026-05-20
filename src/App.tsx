import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, Calendar as CalendarIcon, MessageSquare, Info, Star, Heart } from "lucide-react";
import AIPostWriter from "./components/AIPostWriter";
import GraphicsStudio from "./components/GraphicsStudio";
import CalendarGuide from "./components/CalendarGuide";
import { motion } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"texts" | "graphics" | "calendar">("texts");
  
  // Cross-component coordination state
  const [selectedHolidayPresetId, setSelectedHolidayPresetId] = useState<string>("christmas");
  const [canvasTitle, setCanvasTitle] = useState("Wesołych Świąt!");
  const [canvasSubtitle, setCanvasSubtitle] = useState("Cudownych, ciepłych chwil w rodzinnym gronie");
  const [canvasGradient, setCanvasGradient] = useState("linear-gradient(135deg, #0f2027, #2c5364)");
  const [canvasStickers, setCanvasStickers] = useState<string[]>(["🎄", "🎁", "❄️", "☃️"]);

  // Coordination helper
  const handleSendPresetToCanvas = (title: string, subtitle: string, gradient: string, stickers: string[]) => {
    setCanvasTitle(title);
    setCanvasSubtitle(subtitle);
    setCanvasGradient(gradient);
    setCanvasStickers(stickers);
    setActiveTab("graphics");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900/30 selection:text-emerald-950 text-neutral-800 dark:text-neutral-100 flex flex-col">
      {/* Elegancja góry: Top bar / Brand */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border-b border-slate-100 dark:border-neutral-850 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-1.5">
                Social Holiday Studio
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold">
                Kreator Postów i Grafik Świątecznych
              </p>
            </div>
          </div>

          {/* Wybór aktywnych zakładek */}
          <div className="flex bg-slate-100 dark:bg-neutral-950 p-1.5 rounded-xl border border-slate-200/50 dark:border-neutral-900">
            <button
              onClick={() => setActiveTab("texts")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "texts"
                  ? "bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Generator Postów AI
            </button>
            <button
              onClick={() => setActiveTab("graphics")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "graphics"
                  ? "bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Studio Graficzne
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "calendar"
                  ? "bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Kalendarz Świąt
            </button>
          </div>
        </div>
      </header>

      {/* Główna sekcja contentu */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* Przewodnik/Info Box */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-150 dark:border-emerald-900/30 rounded-2xl p-4 mb-8 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold flex items-center gap-1">
              💡 Jak działa aplikacja?
            </p>
            <p className="leading-relaxed">
              Zaprojektowaliśmy zintegrowane, lokalne środowisko pracy. Zamiast otwierać osobno edytory tekstów i obrazy, możesz skorzystać ze zintegrowanego workflow:
              wygeneruj posty o wybranym święcie w zakładce <strong className="underline decoration-emerald-500">Generator Postów AI</strong>, a następnie kliknij przycisk <strong className="bg-emerald-100 dark:bg-emerald-900/40 px-1 py-0.5 rounded">Załaduj do grafiki 🎨</strong>, aby tekst z posta oraz dopasowana kolorystyka automatycznie przeniosły się na płótno w zakładce <strong className="underline decoration-emerald-500">Studio Graficzne</strong>. Na koniec pobierz grafikę oraz skopiuj post!
            </p>
          </div>
        </div>

        {/* Dynamiczny Render Wybranego Widoku */}
        <div className="pb-12">
          {activeTab === "texts" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AIPostWriter
                onSendPresetToCanvas={handleSendPresetToCanvas}
                selectedPresetId={selectedHolidayPresetId}
                onSelectPreset={setSelectedHolidayPresetId}
              />
            </motion.div>
          )}

          {activeTab === "graphics" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GraphicsStudio
                initialTitle={canvasTitle}
                initialSubtitle={canvasSubtitle}
                initialGradient={canvasGradient}
                initialStickers={canvasStickers}
              />
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CalendarGuide
                onLoadPreset={setSelectedHolidayPresetId}
                onSendPresetToCanvas={handleSendPresetToCanvas}
                onSwitchTab={setActiveTab}
              />
            </motion.div>
          )}
        </div>
      </main>

      {/* Stopka techniczna */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-850 px-6 py-5 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <p className="flex items-center justify-center gap-1 sm:justify-start">
            Zbudowane dla <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Specjalistów ds. Social Media
          </p>
          <p className="font-mono text-[10px]">
            Wersja 2.1 • Offline Canvas Render Engine • Gemini 3.5 Active
          </p>
        </div>
      </footer>
    </div>
  );
}
