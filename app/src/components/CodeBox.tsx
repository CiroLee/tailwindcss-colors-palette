'use client';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import type { BundledLanguage } from 'shiki';
import { codeToHtml } from 'shiki';
interface Props {
  code: string;
  lang?: BundledLanguage;
  className?: string;
}

export default function CodeBox({ code, lang = 'tsx', className }: Props) {
  const [out, setOut] = useState('');
  const getCode = useCallback(
    async (code: string) => {
      const out = await codeToHtml(code, {
        lang,
        theme: 'vitesse-dark',
      });
      setOut(out);
    },
    [lang],
  );

  useEffect(() => {
    getCode(code);
  }, [code, getCode]);

  return (
    <div className={cn('relative h-full overflow-auto text-sm [&_pre]:h-full [&_pre]:p-3', className)}>
      <div dangerouslySetInnerHTML={{ __html: out }}></div>
    </div>
  );
}
