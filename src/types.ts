export interface PostVariation {
  title: string;
  content: string;
  suggestedVisualTip: string;
}

export interface HolidayPreset {
  id: string;
  name: string;
  date: string;
  description: string;
  emojis: string[];
  stickers: string[];
  gradient: string;
  textPreset: {
    title: string;
    subtitle: string;
  };
}

export interface CanvasTextItem {
  id: string;
  text: string;
  size: number;
  color: string;
  font: string;
  x: number;
  y: number;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
}

export interface CanvasStickerItem {
  id: string;
  emoji: string;
  size: number;
  x: number;
  y: number;
  rotation: number; // in degrees
}
