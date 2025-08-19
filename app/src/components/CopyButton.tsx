'use client';
import { cn, copyToClipboard } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useRef, useState } from 'react';

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}
export default function CopyButton({ className, text, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  const handleCopy = () => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    copyToClipboard(text).then(() => {
      setCopied(true);
    });

    timer.current = setTimeout(() => {
      setCopied(false);
      timer.current = null;
    }, 2000);
  };
  return (
    <button
      className={cn(
        'inline-flex size-7 items-center justify-center opacity-60 transition hover:opacity-100',
        className,
      )}
      {...props}
      onClick={handleCopy}>
      {copied ? (
        <Check size={18} strokeWidth={1.5} className="text-neutral-400" />
      ) : (
        <Copy size={18} strokeWidth={1.5} className="text-neutral-400" />
      )}
    </button>
  );
}
