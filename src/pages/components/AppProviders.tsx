import { RainbowProvider } from '~/components/common/providers/RainbowProvider';
import { Toaster } from 'sonner';
import { UserAddressProvider } from '~/contexts/UserAddressContext';
import { Suspense } from 'react';
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
      <Toaster richColors position='top-right' />
    </RainbowProvider>
  );
}
