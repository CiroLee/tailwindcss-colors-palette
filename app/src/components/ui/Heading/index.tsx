'use client';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const heading = cva('font-normal', {
  variants: {
    as: {
      h1: 'text-[2.5rem]/[1.3] tracking-[0.5px] font-bold',
      h2: 'text-[2rem]/[1.4] tracking-[0.3px] font-semibold',
      h3: 'text-[1.75rem]/[1.5] tracking-[0.2px] font-semibold',
      h4: 'text-[1.5rem]/[1,5] tracking-[0.1px] font-medium',
      h5: 'text-[1,25rem]/[1.6] tracking-0 font-medium',
      h6: 'text-[1rem]/[1.5] -tracking-[0.2px]',
    },
  },
});

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  ref?: React.Ref<HTMLHeadingElement>;
}
export default function Heading({ as: Tag, className, ...props }: HeadingProps) {
  const getLevel = () => {
    const match = Tag.match(/\d+/g);
    return match ? Number(match[0]) : 1;
  };
  return <Tag className={cn(heading({ as: Tag, className }))} role="heading" aria-level={getLevel()} {...props} />;
}
