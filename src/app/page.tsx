'use client';

import dynamic from 'next/dynamic';

const PuyoGame = dynamic(() => import('@/components/PuyoGame'), { ssr: false });

export default function Home() {
  return <PuyoGame />;
}
