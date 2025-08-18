import { cn } from '@/lib/utils';
import type { BundledLanguage } from 'shiki';
import CodeBox from './CodeBox';
import Heading from './ui/Heading';

interface CodeContainerProps {
  className?: string;
  lang?: BundledLanguage;
  code: string;
  title?: React.ReactNode;
}
export default function CodeContainer({ className, code, lang, title }: CodeContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-[calc(100vw_-_var(--spacing)*4)] md:w-[60%] md:max-w-2xl [&_pre]:w-fit md:[&_pre]:w-auto',
        className,
      )}>
      <Heading as="h5" className="mb-2">
        {title}
      </Heading>
      <CodeBox code={code} lang={lang} className="rounded-md ring-2 ring-[#1d1d1d]/80" />
    </div>
  );
}
