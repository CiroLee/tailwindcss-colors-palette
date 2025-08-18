import CodeContainer from '@/components/CodeContainer';
import PaletteCard from '@/components/PaletteCard';
import Heading from '@/components/ui/Heading';
import { usageCode } from '@/config/code.config';
import Image from 'next/image';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <nav className="fixed top-0 left-0 z-10 flex h-14 w-full items-center justify-end px-4">
        <Link
          href="https://github.com/CiroLee/tailwindcss-colors-palette"
          target="_blank"
          className="flex size-10 items-center justify-center rounded"
          rel="noopener noreferrer">
          <Image src="/icons/github.svg" width={24} height={24} className="z-1 size-5" alt="github" />
        </Link>
      </nav>
      <Heading as="h1" className="mt-20 mb-4 text-center">
        tailwindcss-colors-palette
      </Heading>
      <p className="px-4 text-center text-sm text-neutral-400">
        A color palette plugin for Tailwind CSS 4, providing easy-to-use color palettes for your projects.
      </p>
      <CodeContainer
        lang="bash"
        code="npm install tailwindcss-colors-palette"
        className="mt-8 [&_pre]:w-full"
        title="Installation"
      />
      <CodeContainer lang="ts" code={usageCode} title="Usage" className="mt-8 [&_pre]:w-fit md:[&_pre]:w-full" />
      <Heading as="h3" className="mt-20 mb-4 text-center">
        Palettes
      </Heading>
      <div className="mx-auto grid gap-4 px-4 pb-20 md:grid-cols-4 lg:max-w-6xl">
        <PaletteCard paletteName="universal" brandName="Universal" middle="5" gradientLength={12} />
        <PaletteCard paletteName="ant" brandName="Ant Design" middle="6" gradientLength={9} />
        <PaletteCard paletteName="chakra" brandName="Chakra" middle="500" gradientLength={10} />
      </div>
      <div
        className="fixed inset-0 -z-1"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0%, transparent 40%), linear-gradient(120deg, #0f0e17 0%, #1a1b26 100%)',
        }}
      />
    </div>
  );
}
