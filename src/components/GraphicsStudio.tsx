import React, { useRef, useState, useEffect } from "react";
import { 
  Download, Plus, Settings, Type as TypeIcon, Image as ImageIcon, Smile, 
  Trash2, Layers, Move, RefreshCw, Undo, ChevronUp, ChevronDown, Check, Play 
} from "lucide-react";
import { CanvasTextItem, CanvasStickerItem } from "../types";
import { FONT_OPTIONS, DIMENSIONS_PRESETS } from "../data/holidays";

interface GraphicsStudioProps {
  initialTitle: string;
  initialSubtitle: string;
  initialGradient: string;
  initialStickers: string[];
}

export default function GraphicsStudio({ 
  initialTitle, 
  initialSubtitle, 
  initialGradient, 
  initialStickers 
}: GraphicsStudioProps) {
  // Dimension State
  const [selectedDimension, setSelectedDimension] = useState(DIMENSIONS_PRESETS[0]);
  
  // Design Elements State
  const [gradientStart, setGradientStart] = useState("#0f2027");
  const [gradientEnd, setGradientEnd] = useState("#2c5364");
  const [gradientStyle, setGradientStyle] = useState<"linear" | "radial">("linear");
  const [solidBackground, setSolidBackground] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  
  // Custom brand Logo state
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [logoOpacity, setLogoOpacity] = useState(0.85);
  const [logoSize, setLogoSize] = useState(80);
  const [logoPosition, setLogoPosition] = useState<"topLeft" | "topRight" | "bottomLeft" | "bottomRight">("topRight");

  // Layers list
  const [textItems, setTextItems] = useState<CanvasTextItem[]>([]);
  const [stickerItems, setStickerItems] = useState<CanvasStickerItem[]>([]);
  
  // Interactivity state
  const [selectedElement, setSelectedElement] = useState<{ type: "text" | "sticker"; id: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // Parse custom gradient hex codes
  const parseGradientColors = (gradientStr: string) => {
    const hexPattern = /#[0-9a-fA-F]{6}/g;
    const matches = gradientStr.match(hexPattern);
    if (matches && matches.length >= 2) {
      return { start: matches[0], end: matches[1] };
    }
    return { start: "#0f2027", end: "#2c5364" };
  };

  // Synchronize incoming holiday preset values
  useEffect(() => {
    if (initialTitle || initialSubtitle) {
      const colors = parseGradientColors(initialGradient);
      setGradientStart(colors.start);
      setGradientEnd(colors.end);
      setSolidBackground(null);
      setBgImage(null);

      // Initialize default styled text items at 1080x1080 ratios
      const titleItem: CanvasTextItem = {
        id: "title-" + Date.now(),
        text: initialTitle || "Wesołych Świąt!",
        size: 72,
        color: "#ffffff",
        font: "'Playfair Display', Georgia, serif",
        x: 540,
        y: 420,
        bold: true,
        italic: false,
        align: "center"
      };

      const subtitleItem: CanvasTextItem = {
        id: "subtitle-" + Date.now(),
        text: initialSubtitle || "Cudownego czasu i miłego odpoczynku",
        size: 34,
        color: "#f3f4f6",
        font: "Inter, sans-serif",
        x: 540,
        y: 520,
        bold: false,
        italic: true,
        align: "center"
      };

      const brandingItem: CanvasTextItem = {
        id: "brand-" + Date.now(),
        text: "@TwojaNazwaFirmy",
        size: 24,
        color: "#10b981",
        font: "'JetBrains Mono', monospace",
        x: 540,
        y: 980,
        bold: true,
        italic: false,
        align: "center"
      };

      setTextItems([titleItem, subtitleItem, brandingItem]);

      // Spawn some stickers gracefully spread out
      const newStickers: CanvasStickerItem[] = initialStickers.slice(0, 4).map((emoji, idx) => ({
        id: `sticker-${idx}-${Date.now()}`,
        emoji,
        size: 90,
        x: 200 + idx * 220,
        y: idx % 2 === 0 ? 220 : 740,
        rotation: (idx % 2 === 0 ? 15 : -15)
      }));

      setStickerItems(newStickers);
      setSelectedElement(null);
    }
  }, [initialTitle, initialSubtitle, initialGradient, initialStickers]);

  // Handle Canvas Drawing Loop
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = selectedDimension;
    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background
    if (bgImage) {
      // Scale cover background image
      const scale = Math.max(width / bgImage.width, height / bgImage.height);
      const x = (width / 2) - (bgImage.width / 2) * scale;
      const y = (height / 2) - (bgImage.height / 2) * scale;
      ctx.drawImage(bgImage, x, y, bgImage.width * scale, bgImage.height * scale);
      
      // Draw a subtle dark overlay for text readability
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(0, 0, width, height);
    } else if (solidBackground) {
      ctx.fillStyle = solidBackground;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Draw Gradient
      let fillGradient;
      if (gradientStyle === "linear") {
        fillGradient = ctx.createLinearGradient(0, 0, width, height);
      } else {
        fillGradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) / 1.5);
      }
      fillGradient.addColorStop(0, gradientStart);
      fillGradient.addColorStop(1, gradientEnd);
      ctx.fillStyle = fillGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Theme Background Grid Accents (Subtle geometry for premium vibe)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 50; i < width; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 50; j < height; j += 100) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // 3. Draw Brand Logo
    if (logoImage) {
      ctx.save();
      ctx.globalAlpha = logoOpacity;
      
      let lx = 50;
      let ly = 50;
      const lWidth = logoSize;
      const lHeight = (logoImage.height / logoImage.width) * logoSize;

      if (logoPosition === "topRight") {
        lx = width - lWidth - 50;
      } else if (logoPosition === "bottomLeft") {
        ly = height - lHeight - 50;
      } else if (logoPosition === "bottomRight") {
        lx = width - lWidth - 50;
        ly = height - lHeight - 50;
      }

      ctx.drawImage(logoImage, lx, ly, lWidth, lHeight);
      ctx.restore();
    }

    // 4. Draw Stickers
    stickerItems.forEach((sticker) => {
      ctx.save();
      ctx.translate(sticker.x, sticker.y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.font = `${sticker.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw subtle drop shadow for emoji stickers
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      
      ctx.fillText(sticker.emoji, 0, 0);
      
      // If selected, draw accent border
      if (selectedElement?.type === "sticker" && selectedElement.id === sticker.id) {
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(-sticker.size / 1.5, -sticker.size / 1.5, sticker.size * 1.33, sticker.size * 1.33);
      }
      ctx.restore();
    });

    // 5. Draw Texts
    textItems.forEach((item) => {
      ctx.save();
      let fontStyle = "";
      if (item.bold) fontStyle += "bold ";
      if (item.italic) fontStyle += "italic ";
      
      ctx.font = `${fontStyle}${item.size}px ${item.font}`;
      ctx.fillStyle = item.color;
      ctx.textAlign = item.align;
      ctx.textBaseline = "middle";

      // Precise dropshadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      ctx.fillText(item.text, item.x, item.y);

      // Selection overlay border
      if (selectedElement?.type === "text" && selectedElement.id === item.id) {
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        
        ctx.shadowColor = "transparent"; // disable shadow for rect border
        const metrics = ctx.measureText(item.text);
        const tWidth = metrics.width + 30;
        const tHeight = item.size + 15;

        let rx = item.x - tWidth / 2;
        if (item.align === "left") rx = item.x - 10;
        if (item.align === "right") rx = item.x - tWidth + 10;
        
        const ry = item.y - tHeight / 2;

        ctx.strokeRect(rx, ry, tWidth, tHeight);
      }
      ctx.restore();
    });
  };

  useEffect(() => {
    drawCanvas();
  }, [selectedDimension, gradientStart, gradientEnd, gradientStyle, solidBackground, bgImage, logoImage, logoOpacity, logoSize, logoPosition, textItems, stickerItems, selectedElement]);

  // Handle interaction click & select & drag
  const getCanvasMouseCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Scale standard coordinates correctly based on physical vs styles canvas sizes
    const clickX = ((e.clientX - rect.left) / rect.width) * selectedDimension.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * selectedDimension.height;

    return { x: clickX, y: clickY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasMouseCoordinates(e);
    
    // 1. Check if clicked on a sticker first (foreground)
    for (let i = stickerItems.length - 1; i >= 0; i--) {
      const sticker = stickerItems[i];
      const dist = Math.sqrt((sticker.x - x) ** 2 + (sticker.y - y) ** 2);
      if (dist < sticker.size / 1.5) {
        setSelectedElement({ type: "sticker", id: sticker.id });
        setIsDragging(true);
        setDragOffset({ x: x - sticker.x, y: y - sticker.y });
        return;
      }
    }

    // 2. Check if clicked on a text
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        for (let i = textItems.length - 1; i >= 0; i--) {
          const item = textItems[i];
          ctx.font = `${item.bold ? "bold " : ""}${item.size}px ${item.font}`;
          const textW = ctx.measureText(item.text).width;
          const textH = item.size;

          let insideX = false;
          if (item.align === "center") {
            insideX = x >= item.x - textW / 2 - 15 && x <= item.x + textW / 2 + 15;
          } else if (item.align === "left") {
            insideX = x >= item.x - 15 && x <= item.x + textW + 15;
          } else {
            insideX = x >= item.x - textW - 15 && x <= item.x + 15;
          }

          const insideY = y >= item.y - textH / 2 - 15 && y <= item.y + textH / 2 + 15;

          if (insideX && insideY) {
            setSelectedElement({ type: "text", id: item.id });
            setIsDragging(true);
            setDragOffset({ x: x - item.x, y: y - item.y });
            return;
          }
        }
      }
    }

    setSelectedElement(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;
    const { x, y } = getCanvasMouseCoordinates(e);

    const targetX = x - dragOffset.x;
    const targetY = y - dragOffset.y;

    if (selectedElement.type === "text") {
      setTextItems(prev =>
        prev.map(item =>
          item.id === selectedElement.id ? { ...item, x: targetX, y: targetY } : item
        )
      );
    } else {
      setStickerItems(prev =>
        prev.map(sticker =>
          sticker.id === selectedElement.id ? { ...sticker, x: targetX, y: targetY } : sticker
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Helper adding layers
  const addNewText = () => {
    const newItem: CanvasTextItem = {
      id: "text-" + Date.now(),
      text: "Nowy Tekst",
      size: 40,
      color: "#ffffff",
      font: "Inter, sans-serif",
      x: selectedDimension.width / 2,
      y: selectedDimension.height / 2,
      bold: false,
      italic: false,
      align: "center"
    };
    setTextItems([...textItems, newItem]);
    setSelectedElement({ type: "text", id: newItem.id });
  };

  const addSpecificSticker = (emoji: string) => {
    const newSticker: CanvasStickerItem = {
      id: "sticker-" + Date.now(),
      emoji,
      size: 100,
      x: selectedDimension.width / 2,
      y: selectedDimension.height / 2,
      rotation: 0
    };
    setStickerItems([...stickerItems, newSticker]);
    setSelectedElement({ type: "sticker", id: newSticker.id });
  };

  // Get selected element properties
  const activeText = selectedElement?.type === "text"
    ? textItems.find(t => t.id === selectedElement.id)
    : null;

  const activeSticker = selectedElement?.type === "sticker"
    ? stickerItems.find(s => s.id === selectedElement.id)
    : null;

  // Modifiers
  const updateActiveText = (fields: Partial<CanvasTextItem>) => {
    if (!activeText) return;
    setTextItems(prev => prev.map(t => t.id === activeText.id ? { ...t, ...fields } as CanvasTextItem : t));
  };

  const updateActiveSticker = (fields: Partial<CanvasStickerItem>) => {
    if (!activeSticker) return;
    setStickerItems(prev => prev.map(s => s.id === activeSticker.id ? { ...s, ...fields } as CanvasStickerItem : s));
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    if (selectedElement.type === "text") {
      setTextItems(prev => prev.filter(t => t.id !== selectedElement.id));
    } else {
      setStickerItems(prev => prev.filter(s => s.id !== selectedElement.id));
    }
    setSelectedElement(null);
  };

  // Upload actions
  const handleBGImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setBgImage(img);
          setSolidBackground(null);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setLogoImage(img);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadBanner = () => {
    // Clear selection borders before export to ensure pristine picture quality!
    setSelectedElement(null);
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `smart_holiday_${selectedDimension.width}x${selectedDimension.height}.png`;
      link.href = dataUrl;
      link.click();
    }, 100);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Kolumna lewa: Podgląd Canvsu i wybór formatu */}
      <div className="xl:col-span-7 flex flex-col space-y-4">
        
        {/* Kontrolki Szybkiego formatu */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Wymiary grafiki:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DIMENSIONS_PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelectedDimension(p)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedDimension.name === p.name
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-neutral-50 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100"
                }`}
              >
                {p.name} ({p.width}x{p.height}px)
              </button>
            ))}
          </div>
        </div>

        {/* Live Canvas Box */}
        <div className="bg-neutral-900/5 hover:bg-neutral-900/10 dark:bg-neutral-950/40 p-6 rounded-2xl border border-neutral-150 dark:border-neutral-800/40 flex items-center justify-center min-h-[460px] relative group overflow-hidden transition-all">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="shadow-2xl rounded-lg max-w-full max-h-[480px] object-contain cursor-crosshair border border-white/25"
            style={{
              aspectRatio: `${selectedDimension.width} / ${selectedDimension.height}`,
            }}
          />
          <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-md text-[10px] text-white pointer-events-none flex items-center gap-1.5 font-mono">
            <Move className="w-3 h-3 text-emerald-400" /> Chwyć i przeciągaj elementy bezpośrednio na grafice
          </div>
        </div>

        {/* Predefiniowane szybkie naklejki/emotikony */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-4 shadow-sm">
          <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Kliknij, aby dodać radosną naklejkę świąteczną (Sticker):
          </span>
          <div className="flex flex-wrap gap-2">
            {["🎄", "🎁", "❄️", "☃️", "✨", "🥂", "🎆", "🐣", "🐰", "🌷", "🎃", "👻", "❤️", "💖", "🌸", "🧸", "🏷️", "🔥", "🚀", "💰"].map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => addSpecificSticker(emoji)}
                className="w-10 h-10 flex items-center justify-center text-xl bg-neutral-50 hover:bg-emerald-50 active:scale-95 border border-neutral-150 dark:border-neutral-800 rounded-lg cursor-pointer transition-all"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kolumna prawa: Panele konfiguracji / Warstwy i eksport */}
      <div className="xl:col-span-5 flex flex-col space-y-5">
        
        {/* 1. Panel Generowania / Downloadu */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-sm text-center">
          <button
            onClick={downloadBanner}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 font-bold text-white rounded-xl shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Pobierz Gotową Grafikę (PNG)
          </button>
          <span className="block text-[10px] text-neutral-400 mt-2 font-mono">
            Bezkosztowy render 2D bezpośrednio do krystalicznego pliku PNG.
          </span>
        </div>

        {/* 2. Dobór tła */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-neutral-50 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              🎨 Stylizacja Tła
            </h3>
            <div className="flex bg-neutral-100 dark:bg-neutral-950 p-0.5 rounded-lg text-[10px]">
              <button
                onClick={() => { setBgImage(null); setSolidBackground(null); }}
                className={`px-2 py-1 rounded-md ${!bgImage && !solidBackground ? "bg-white font-medium shadow-sm text-neutral-900" : "text-neutral-500"}`}
              >
                Gradient
              </button>
              <button
                onClick={() => { setBgImage(null); setSolidBackground("#0f172a"); }}
                className={`px-2 py-1 rounded-md ${solidBackground ? "bg-white font-medium shadow-sm text-neutral-900" : "text-neutral-500"}`}
              >
                Jednolite
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`px-2 py-1 rounded-md ${bgImage ? "bg-white font-medium shadow-sm text-neutral-900" : "text-neutral-500"}`}
              >
                Własne Foto
              </button>
            </div>
          </div>

          {!bgImage && !solidBackground && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Kolor Startowy</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={gradientStart}
                    onChange={(e) => setGradientStart(e.target.value)}
                    className="w-8 h-8 rounded border border-neutral-200 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={gradientStart}
                    onChange={(e) => setGradientStart(e.target.value)}
                    className="w-full text-xs font-mono py-1 px-2 border rounded border-neutral-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Kolor Końcowy</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={gradientEnd}
                    onChange={(e) => setGradientEnd(e.target.value)}
                    className="w-8 h-8 rounded border border-neutral-200 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={gradientEnd}
                    onChange={(e) => setGradientEnd(e.target.value)}
                    className="w-full text-xs font-mono py-1 px-2 border rounded border-neutral-200"
                  />
                </div>
              </div>
            </div>
          )}

          {solidBackground && (
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Jednolity Kolor Tła</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={solidBackground}
                  onChange={(e) => setSolidBackground(e.target.value)}
                  className="w-10 h-10 rounded border border-neutral-200 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={solidBackground}
                  onChange={(e) => setSolidBackground(e.target.value)}
                  className="w-32 text-xs font-mono px-3 py-1.5 border rounded border-neutral-200"
                />
              </div>
            </div>
          )}

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleBGImageUpload}
              accept="image/*"
              className="hidden"
            />
            {bgImage && (
              <div className="p-3 bg-neutral-100 rounded-lg flex items-center justify-between text-xs">
                <span>Załadowano zdjęcie w tle</span>
                <button
                  onClick={() => setBgImage(null)}
                  className="text-red-500 hover:underline"
                >
                  Usuń
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Panel Warstwy aktywnej (Text / Sticker) */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-neutral-50 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              🛠️ Edycja wybranej warstwy
            </h3>
            <button
              onClick={addNewText}
              className="px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 rounded flex items-center gap-1 cursor-pointer transition"
            >
              <Plus className="w-3 h-3" /> Dodaj Tekst
            </button>
          </div>

          {!selectedElement && (
            <div className="text-center py-6 text-xs text-neutral-400">
              Dotknij lub kliknij dowolne hasło lub naklejkę na grafice po lewej stronie, aby odblokować zaawansowany kreator warstwy.
            </div>
          )}

          {/* Aktywny panel tekstu */}
          {selectedElement?.type === "text" && activeText && (
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Zawartość tekstu</label>
                <input
                  type="text"
                  value={activeText.text}
                  onChange={(e) => updateActiveText({ text: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Krój czcionki</label>
                  <select
                    value={activeText.font}
                    onChange={(e) => updateActiveText({ font: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border rounded border-neutral-200"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Kolor liter</label>
                  <div className="flex gap-1">
                    <input
                      type="color"
                      value={activeText.color}
                      onChange={(e) => updateActiveText({ color: e.target.value })}
                      className="w-8 h-8 rounded border p-0 cursor-pointer"
                    />
                    <button
                      onClick={() => updateActiveText({ color: "#ffffff" })}
                      className="text-[10px] border px-1.5 rounded hover:bg-neutral-50"
                    >
                      Biały
                    </button>
                    <button
                      onClick={() => updateActiveText({ color: "#10b981" })}
                      className="text-[10px] border px-1.5 rounded hover:bg-neutral-50"
                    >
                      Zieleń
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Rozmiar</label>
                  <input
                    type="number"
                    value={activeText.size}
                    min={10}
                    max={200}
                    onChange={(e) => updateActiveText({ size: parseInt(e.target.value) || 20 })}
                    className="w-full px-2 py-1 border rounded text-xs"
                  />
                </div>
                <div className="flex items-end justify-center gap-1 pb-1">
                  <button
                    onClick={() => updateActiveText({ bold: !activeText.bold })}
                    className={`p-1 px-2.5 rounded text-xs border font-bold ${activeText.bold ? "bg-emerald-100 border-emerald-300 text-emerald-900" : ""}`}
                  >
                    B
                  </button>
                  <button
                    onClick={() => updateActiveText({ italic: !activeText.italic })}
                    className={`p-1 px-2.5 rounded text-xs border italic ${activeText.italic ? "bg-emerald-100 border-emerald-300 text-emerald-900" : ""}`}
                  >
                    I
                  </button>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Poziom</label>
                  <select
                    value={activeText.align}
                    onChange={(e) => updateActiveText({ align: e.target.value as any })}
                    className="w-full px-1 py-1 border rounded text-xs"
                  >
                    <option value="left">Do Lewej</option>
                    <option value="center">Wyśrodkuj</option>
                    <option value="right">Do Prawej</option>
                  </select>
                </div>
              </div>

              {/* Slider precyzyjnego pozycjonowania */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex justify-between text-[10px] text-neutral-400 font-bold uppercase">
                  <span>Położenie Y (W pionie)</span>
                  <span>{Math.round(activeText.y)}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={selectedDimension.height - 20}
                  value={activeText.y}
                  onChange={(e) => updateActiveText({ y: parseInt(e.target.value) })}
                  className="w-full accent-emerald-600"
                />
              </div>

              <button
                onClick={deleteSelectedElement}
                className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Usuń tę warstwę tekstową
              </button>
            </div>
          )}

          {/* Aktywny panel naklejki */}
          {selectedElement?.type === "sticker" && activeSticker && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border">
                  {activeSticker.emoji}
                </span>
                <div>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Warstwa: Aktywna Naklejka</p>
                  <p className="text-[10px] text-neutral-400">Możesz swobodnie przeciągać i skalować poniżej.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Wielkość naklejki</label>
                  <input
                    type="range"
                    min={30}
                    max={300}
                    value={activeSticker.size}
                    onChange={(e) => updateActiveSticker({ size: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-xs font-mono">{activeSticker.size}px</span>
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1 font-semibold uppercase">Obrót (Kąt)</label>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={activeSticker.rotation}
                    onChange={(e) => updateActiveSticker({ rotation: parseInt(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-xs font-mono">{activeSticker.rotation}°</span>
                </div>
              </div>

              <button
                onClick={deleteSelectedElement}
                className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Usuń tę naklejkę
              </button>
            </div>
          )}
        </div>

        {/* 4. Opcjonalne dodanie własnego logotypu marki */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 border-b pb-2 border-neutral-50 dark:border-neutral-800">
            🛡️ Logotyp Marki / Znak wodny
          </h3>
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-neutral-400">Wrzuć przeźroczysty plik PNG logo Twojej marki lub klienta, aby sygnować grafikę:</span>
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            
            {!logoImage ? (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="py-2.5 px-4 text-xs font-bold border border-dashed border-neutral-300 rounded-lg hover:bg-neutral-50 transition cursor-pointer text-neutral-600"
              >
                ➕ Załaduj logo firmy (PNG)
              </button>
            ) : (
              <div className="space-y-3.5 p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Logo Załadowane</span>
                  <button onClick={() => setLogoImage(null)} className="text-[10px] text-red-500 hover:underline">Usuń</button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-0.5 font-bold uppercase">Szerokość</label>
                    <input
                      type="range"
                      min={30}
                      max={220}
                      value={logoSize}
                      onChange={(e) => setLogoSize(parseInt(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-0.5 font-bold uppercase">Przeźroczystość</label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={logoOpacity * 100}
                      onChange={(e) => setLogoOpacity(parseInt(e.target.value) / 100)}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1 font-bold uppercase">Pozycja na grafice</label>
                  <div className="grid grid-cols-4 gap-1.5 text-[9px] font-bold text-center">
                    {(["topLeft", "topRight", "bottomLeft", "bottomRight"] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setLogoPosition(pos)}
                        className={`p-1 border rounded transition ${logoPosition === pos ? "bg-emerald-600 text-white border-emerald-600" : "bg-white hover:bg-neutral-100"}`}
                      >
                        {pos === "topLeft" && "Lewy Górny"}
                        {pos === "topRight" && "Prawy Górny"}
                        {pos === "bottomLeft" && "Lewy Dolny"}
                        {pos === "bottomRight" && "Prawy Dolny"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
