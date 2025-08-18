import { cn } from '@/lib/utils';
import type { BundledLanguage } from 'shiki';
import { codeToHtml } from 'shiki';
interface Props {
  code: string;
  lang?: BundledLanguage;
  className?: string;
  highlightLines?: number[];
  highlightRange?: number[][];
  diffAddLines?: number[];
  diffRemoveLines?: number[];
}

export default async function CodeBox({ code, lang = 'tsx', className }: Props) {
  const out = await codeToHtml(code, {
    lang,
    theme: 'vitesse-dark',
  });

  return (
    <div className={cn('relative h-full overflow-auto text-sm [&_pre]:h-full [&_pre]:p-3', className)}>
      <div dangerouslySetInnerHTML={{ __html: out }}></div>
    </div>
  );
}
