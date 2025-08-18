'use client';

import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { RainbowProvider } from '~/components/common/providers/RainbowProvider';
import { UserAddressProvider } from '~/contexts/UserAddressContext';
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RainbowProvider>
      <UserAddressProvider>
        <Suspense
          fallback={<div className='h-16 bg-black/50 backdrop-blur-sm' />}
        >
          {children}
        </Suspense>
      </UserAddressProvider>
      <Toaster
        richColors
        theme='light'
        position='top-right'
        toastOptions={{
          style: {
            background: '#FFA600',
            color: '#ffffff',
            border: '1px solid #333',
          },
        }}
      />
    </RainbowProvider>
  );
}
