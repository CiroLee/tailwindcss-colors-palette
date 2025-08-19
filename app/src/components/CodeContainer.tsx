import { cn } from '@/lib/utils';
import type { BundledLanguage } from 'shiki';
import CodeBox from './CodeBox';
import CopyButton from './CopyButton';
import Heading from './ui/Heading';

interface CodeContainerProps {
  className?: string;
  lang?: BundledLanguage;
  code: string;
  title?: React.ReactNode;
  showCopy?: boolean;
  description?: React.ReactNode;
}
export default function CodeContainer({ className, code, lang, title, description, showCopy }: CodeContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-[calc(100vw_-_var(--spacing)*4)] md:max-w-2xl lg:w-[60%] lg:max-w-3xl [&_pre]:w-fit md:[&_pre]:w-auto',
        className,
      )}>
      <Heading as="h5" className="mb-1">
        {title}
      </Heading>
      <div className="mb-2 text-sm text-neutral-400 empty:hidden">{description}</div>
      <div className="relative">
        <CodeBox code={code} lang={lang} className="rounded-md ring-2 ring-[#1d1d1d]/80" />
        {showCopy && <CopyButton text={code} className="absolute top-1/2 right-2 -translate-y-1/2" />}
      </div>
    </div>
  );
}
