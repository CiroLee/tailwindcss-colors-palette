import { cn, copyToClipboard } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Color from 'color';
import { X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CodeBox from './CodeBox';
import CopyButton from './CopyButton';
interface PaletteDialogProps extends React.ComponentPropsWithRef<typeof DialogPrimitive.Root> {
  className?: string;
  title?: string;
  code?: string;
  color: Record<string, string>;
  trigger?: React.ReactNode;
  gradientLength: number;
  excludeColorNames?: string[];
}

const content = cn(
  `relative data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out fixed top-1/2 left-1/2 origin-center -translate-1/2 rounded-md border border-neutral-800 
  bg-neutral-900 p-3 w-[calc(100vw_-_var(--spacing)*2)] md:w-[90%] md:max-w-300 overflow-hidden z-60`,
);
export default function PaletteDialog({
  className,
  trigger,
  title,
  color,
  code,
  gradientLength,
  excludeColorNames = [],
  ...props
}: PaletteDialogProps) {
  const { xTitles, yColors } = parseColor(color);
  const [open, setOpen] = useState(false);

  const copyColor = (text: string) => {
    copyToClipboard(text).then(() => {
      toast.success('Copied!' + ' ' + text, { position: 'top-right' });
    });
  };

  const formatYColor = (color: string, arr: string[]) => {
    // 去除color中包含arr中元素的字符串
    if (!color.includes('-')) return color;
    return arr.reduce((acc, item) => {
      return acc.replace(new RegExp(`-${item}`, 'g'), '');
    }, color);
  };

  const isDarkColor = (colorStr: string) => {
    const color = Color(colorStr);
    return color.isDark();
  };

  return (
    <DialogPrimitive.Root {...props} open={open} onOpenChange={setOpen}>
      {trigger ? <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> : null}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out fixed inset-0 bg-black/60 backdrop-blur-md" />
        <DialogPrimitive.Content className={cn(content, className)}>
          <DialogPrimitive.Title className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-3">
              <span>{title}</span>
              <div className="relative flex items-center gap-2 overflow-hidden rounded-md pr-1 ring-2 ring-neutral-800">
                <CodeBox
                  lang="css"
                  className="flex-1 [&_pre]:py-1.5"
                  code={`@import "tailwindcss-colors-palette/colors/${code}";`}
                />
                <CopyButton text={`@import "tailwindcss-colors-palette/colors/${code}";`} />
              </div>
            </div>
            <DialogPrimitive.Close asChild>
              <X size={18} className="cursor-pointer opacity-60 transition-opacity hover:opacity-100" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Title>
          <div className="mt-6 max-h-[74vh] overflow-auto">
            <div className="flex min-w-3xl overflow-hidden">
              <div className="relative top-5 mt-0.5 flex flex-col gap-1 pr-2">
                {yColors.map((c) => (
                  <div className="flex h-10 items-center justify-end text-sm" key={c}>
                    {formatYColor(c, excludeColorNames)}
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <div
                  className="mb-0.5 grid"
                  style={{ gridTemplateColumns: `repeat(${gradientLength + 1}, minmax(0, 1fr))` }}>
                  {xTitles.map((t) => (
                    <div className="flex justify-center text-sm" key={t}>
                      {t}
                    </div>
                  ))}
                </div>
                <div
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${gradientLength + 1}, minmax(0, 1fr))` }}>
                  {Object.entries(color).map(([k, v]) => (
                    <button
                      key={k}
                      className={cn('group/palette lattice relative h-10 origin-center text-xs text-black', {
                        'text-white': isDarkColor(v),
                      })}
                      style={{ backgroundColor: v }}
                      onClick={() => copyColor(v)}>
                      <span className="opacity-0 transition-opacity group-hover/palette:opacity-100">{v}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function parseColor(color: Record<string, string>) {
  const keys = Object.keys(color);
  const xTitleArr = keys.map((k) => {
    const temp = k.split('-');
    // e.g ma-light-green-a-700, ra-slate-alpha-1
    if (temp.length > 4) {
      return temp
        .slice(-2)
        .join('-')
        .replace(/^(alpha-)/, '');
    }
    return temp.at(-1);
  });

  const yColorsArr = keys.map((k) => {
    const temp = k.split('-');
    // e.g ma-light-green-a-700, ma-light-green-50, ma-green-a-700
    if (temp.length > 3) {
      return temp.slice(1, 3).join('-').replace(/-a$/, '');
    }
    return temp[1];
  });
  const yColors = Array.from(new Set(yColorsArr));
  const xTitles = Array.from(new Set(xTitleArr));

  return { xTitles, yColors };
}
