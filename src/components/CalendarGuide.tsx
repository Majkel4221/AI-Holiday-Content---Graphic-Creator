import React from "react";
import { HOLIDAY_PRESETS } from "../data/holidays";
import { Calendar, ChevronRight, Sparkles, Image as ImageIcon } from "lucide-react";
import { HolidayPreset } from "../types";

interface CalendarGuideProps {
  onLoadPreset: (id: string) => void;
  onSendPresetToCanvas: (title: string, subtitle: string, gradient: string, stickers: string[]) => void;
  onSwitchTab: (tab: "texts" | "graphics") => void;
}

export default function CalendarGuide({ onLoadPreset, onSendPresetToCanvas, onSwitchTab }: CalendarGuideProps) {
  
  const handleLoadToWriter = (id: string) => {
    onLoadPreset(id);
    onSwitchTab("texts");
  };

  const handleLoadToGraphics = (preset: HolidayPreset) => {
    onSendPresetToCanvas(
      preset.textPreset.title,
      preset.textPreset.subtitle,
      preset.gradient,
      preset.stickers
    );
    onSwitchTab("graphics");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 scale-150">
          <Calendar className="w-96 h-96" />
        </div>
        <div className="relative max-w-xl space-y-2">
          <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-emerald-400/20">
            Social Media Holiday Calendar
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Planuj Kampanie Świąteczne z Wyprzedzeniem</h2>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Poniżej znajduje się zestawienie kluczowych świąt i okazji w roku, które generują największe zaangażowanie w mediach społecznościowych. Załaduj gotowe bazy do AI copywritera lub przejdź bezpośrednio do komponowania świątecznych grafik banerowych jednym kliknięciem.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {HOLIDAY_PRESETS.map((preset) => (
          <div
            key={preset.id}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-sm hover:shadow-md hover:border-emerald-200/50 dark:hover:border-emerald-900/30 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 px-2 py-1 bg-emerald-50 dark:bg-emerald-990/20 rounded-md">
                  {preset.date}
                </span>
                <div className="flex space-x-1 text-sm bg-neutral-50 dark:bg-neutral-950 p-1 rounded-md border border-neutral-100 dark:border-neutral-850">
                  {preset.emojis.slice(0, 3).map((emoji, idx) => (
                    <span key={idx}>{emoji}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">{preset.name}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 lines-clamp-3 leading-relaxed">
                  {preset.description}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-50 dark:border-neutral-800 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleLoadToWriter(preset.id)}
                className="py-2 px-3 bg-neutral-50 hover:bg-emerald-50 hover:text-emerald-800 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 rounded-xl text-[11px] font-bold text-neutral-700 dark:text-neutral-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                Napisz Posty
              </button>

              <button
                type="button"
                onClick={() => handleLoadToGraphics(preset)}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/10"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Stwórz Grafikę
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
