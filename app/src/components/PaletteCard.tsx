'use client';
import * as colors from '@/config/colors';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import PaletteDialog from './PaletteDialog';
interface PaletteCardProps {
  paletteName: string;
  brandName?: string;
  middle: string;
  gradient: [number, number];
  onClick?: (paletteName: string, brandName?: string) => void;
}

export default function PaletteCard({ paletteName, brandName, middle, gradient, onClick }: PaletteCardProps) {
  const name = paletteName + 'Colors';
  const colorPalette = colors[name as keyof typeof colors];
  const pickColor = useCallback(() => {
    const colorsArr: string[] = [];
    for (const color in colorPalette) {
      if (color.endsWith(middle)) {
        colorsArr.push(colorPalette[color as keyof typeof colorPalette]);
      }
    }

    return colorsArr;
  }, []);
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded border border-neutral-600 p-1 transition-colors duration-300 hover:border-pink-500',
      )}>
      <ul className="relative grid h-36 grid-cols-4 gap-0 overflow-hidden pb-0">
        {pickColor().map((color, i) => (
          <li key={i} className="palette-block h-12 origin-center" style={{ background: color }}></li>
        ))}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:opacity-100 md:opacity-0">
          <PaletteDialog
            title={brandName}
            color={colorPalette}
            gradient={gradient}
            trigger={
              <button
                className="h-8 cursor-pointer rounded-full bg-black/40 px-3 backdrop-blur-2xl transition-opacity group-hover:opacity-100 md:opacity-0"
                onClick={() => onClick?.(paletteName, brandName)}>
                View
              </button>
            }></PaletteDialog>
        </div>
      </ul>
      <div className="flex h-12 items-center bg-white p-1">
        <p className="text-lg leading-[1em] font-semibold text-black">{brandName}</p>
      </div>
    </div>
  );
}
