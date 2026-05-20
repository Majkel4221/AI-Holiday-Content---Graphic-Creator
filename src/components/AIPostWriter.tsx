import React, { useState } from "react";
import { Sparkles, Copy, Check, ChevronRight, PenTool, Globe, Calendar, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PostVariation, HolidayPreset } from "../types";
import { HOLIDAY_PRESETS } from "../data/holidays";

interface AIPostWriterProps {
  onSendPresetToCanvas: (title: string, subtitle: string, gradient: string, stickers: string[]) => void;
  selectedPresetId: string;
  onSelectPreset: (id: string) => void;
}

export default function AIPostWriter({ onSendPresetToCanvas, selectedPresetId, onSelectPreset }: AIPostWriterProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState("");
  const [style, setStyle] = useState("Radosny / Świąteczny");
  const [tone, setTone] = useState("Inspirujący / Ciepły");
  const [language, setLanguage] = useState("pl");
  const [customHoliday, setCustomHoliday] = useState("");
  const [results, setResults] = useState<PostVariation[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activePreset = HOLIDAY_PRESETS.find(p => p.id === selectedPresetId);
  const holidayName = selectedPresetId === "custom" ? customHoliday : (activePreset?.name || "");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPresetId === "custom" && !customHoliday.trim()) {
      setError("Podaj własną nazwę święta lub wydarzenia!");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          holiday: holidayName,
          details,
          style,
          tone,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Nie udało się wygenerować postu.");
      }

      if (data.posts && data.posts.length > 0) {
        setResults(data.posts);
      } else {
        throw new Error("Otrzymano pustą lub wadliwą strukturę odpowiedzi z AI.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Wystąpił nieoczekiwany błąd serwera. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const handleQuickLoadPreset = (preset: HolidayPreset) => {
    onSelectPreset(preset.id);
    setResults([]);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Panel Formularza (lewy) */}
      <div className="lg:col-span-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm flex flex-col justify-between">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Okazja / Święto
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {HOLIDAY_PRESETS.slice(0, 4).map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleQuickLoadPreset(preset)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                    selectedPresetId === preset.id
                      ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                      : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickLoadPreset(HOLIDAY_PRESETS[4])}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  selectedPresetId === HOLIDAY_PRESETS[4].id
                    ? "border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                {HOLIDAY_PRESETS[4].name}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectPreset("custom");
                  setResults([]);
                  setError(null);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                  selectedPresetId === "custom"
                    ? "border-emerald-500 bg-emerald-200 text-emerald-950 font-semibold"
                    : "border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                ✏️ Własne wydarzenie
              </button>
            </div>

            {selectedPresetId === "custom" ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <input
                  type="text"
                  placeholder="Np. 10-lecie Firmy, Dzień Programisty..."
                  value={customHoliday}
                  onChange={(e) => setCustomHoliday(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </motion.div>
            ) : (
              <div className="text-xs text-neutral-500 p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-100 dark:border-neutral-800">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Preset: </span>
                {activePreset?.description}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Szczegóły kampanii, oferta lub uwagi (opcjonalnie)
            </label>
            <textarea
              rows={3}
              placeholder="Np. Kod rabatowy SWIETA20 dający -20%, darmowa dostawa, śmieszny żart, skup się na ekologicznych opakowaniach..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Grupa odbiorców / Styl
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Młodzieżowy / Luźny">Młodzieżowy / Luźny</option>
                <option value="Radosny / Świąteczny">Radosny / Świąteczny</option>
                <option value="Profesjonalny / Biznesowy">Profesjonalny / Biznesowy</option>
                <option value="Elegancki / Poeterycki">Elegancki / Minimalistyczny</option>
                <option value="Brutalny / Bezpośredni">Dynamiczny / Bezpośredni</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Ton wypowiedzi
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Z humorem">Z humorem & Lekki</option>
                <option value="Inspirujący / Refleksyjny">Inspirujący / Refleksyjny</option>
                <option value="Ciepły / Rodzinny">Ciepły / Rodzinny</option>
                <option value="Informacyjny / Konkretny">Informacyjny / Konkretny</option>
                <option value="Ekscytujący / Wyprzedażowy">Ekscytujący / Wyprzedażowy</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-6 pt-1">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Język posta:</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="lang"
                value="pl"
                checked={language === "pl"}
                onChange={() => setLanguage("pl")}
                className="mr-2 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1">🇵🇱 Polski</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="lang"
                value="en"
                checked={language === "en"}
                onChange={() => setLanguage("en")}
                className="mr-2 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-neutral-700 dark:text-neutral-300 flex items-center gap-1">🇬🇧 Angielski</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/10 cursor-pointer flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generowanie pomysłów przez AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Wygeneruj 3 Warianty Posta</span>
              </>
            )}
          </button>
        </form>

        {activePreset && selectedPresetId !== "custom" && (
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Szybka wysyłka bazy do Studia Graficznego:
            </h4>
            <button
              type="button"
              onClick={() => onSendPresetToCanvas(
                activePreset.textPreset.title,
                activePreset.textPreset.subtitle,
                activePreset.gradient,
                activePreset.stickers
              )}
              className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-neutral-50 dark:bg-neutral-950/40 hover:bg-emerald-50 hover:text-emerald-800 hover:dark:bg-emerald-950/20 hover:dark:text-emerald-400 border border-neutral-100 dark:border-neutral-800 transition-all text-xs cursor-pointer group"
            >
              <div>
                <p className="font-semibold">Baza wizualna: {activePreset.name}</p>
                <p className="text-[10px] text-neutral-400 group-hover:text-emerald-600">Preset gradientu, teksty i stylizowane emotikony</p>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Panel Wyników (prawy) */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        {results.length === 0 && !loading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
            <PenTool className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Gotowy do pisania</h3>
            <p className="text-xs text-neutral-400 max-w-sm mt-1">
              Wybierz świąteczną okazję z listy lub wpisz własną, dopasuj parametry i kliknij przycisk generowania, aby otrzymać 3 unikalne warianty postów stworzone przez model Gemini AI.
            </p>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center p-12 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-950" />
              <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Gemini burzorze mózgów...</h3>
              <p className="text-xs text-neutral-400 mt-1">Projektuję 3 warianty tekstowe i planuję kompozycję wizualną dla Twojej grafiki.</p>
            </div>
          </div>
        )}

        {results.length > 0 && !loading && (
          <AnimatePresence>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                  Wygenerowane Warianty ({results.length})
                </span>
                <span className="text-xs text-neutral-500">Kliknij ikonki pod postem, aby skopiować lub załadować</span>
              </div>

              {results.map((post, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx}
                  className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-150 dark:border-neutral-800 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-50 dark:border-neutral-800">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
                      {post.title}
                    </span>
                    <button
                      onClick={() => copyToClipboard(post.content, idx)}
                      className="text-neutral-500 hover:text-emerald-600 transition-colors p-1"
                      title="Skopiuj treść posta"
                    >
                      {copiedIndex === idx ? (
                        <span className="flex items-center text-xs text-emerald-600 font-semibold gap-1">
                          <Check className="w-3.5 h-3.5" /> Skopiowano
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-xs">
                          <Copy className="w-3.5 h-3.5" /> Kopiuj post
                        </div>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed font-sans font-normal selection:bg-emerald-100">
                    {post.content}
                  </p>

                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/40 dark:border-amber-900/30 rounded-lg text-[11px] text-amber-800 dark:text-amber-400 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      💡 Sugestia Wizualna od AI:
                    </div>
                    <span>{post.suggestedVisualTip}</span>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-neutral-50 dark:border-neutral-800">
                    <span className="text-[10px] text-neutral-400">Podoba Ci się ten styl? Wyślij parametry tekstu do Studia Graficznego:</span>
                    <button
                      onClick={() => {
                        // Attempt to parse out a nice title/subtitle
                        const lines = post.content.split("\n").filter(l => l.trim().length > 0);
                        let titleCandidate = holidayName || "Wesołego Święta!";
                        let subtitleCandidate = "Zapraszamy serdecznie";
                        if (lines.length > 0) {
                          titleCandidate = lines[0].replace(/[#*•_]/g, "").trim().substring(0, 30);
                          if (lines.length > 1) {
                            subtitleCandidate = lines[1].replace(/[#*•_]/g, "").trim().substring(0, 45);
                          }
                        }
                        onSendPresetToCanvas(
                          titleCandidate,
                          subtitleCandidate,
                          activePreset?.gradient || "linear-gradient(135deg, #4f46e5, #06b6d4)",
                          activePreset?.stickers || ["✨", "🌟", "🎉"]
                        );
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800 rounded transition"
                    >
                      Załaduj do grafiki 🎨
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
