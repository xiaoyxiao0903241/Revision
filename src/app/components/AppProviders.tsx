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
        position='top-right'
        theme='light'
        toastOptions={{
          style: {
            background: '#293170',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.40)',
            boxShadow: `0 0 11px 0 rgba(87, 106, 244, 0.8) inset`,
          },
        }}
      />
    </RainbowProvider>
  );
}
