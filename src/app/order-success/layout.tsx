import { Suspense, ReactNode } from 'react';

export default function OrderSuccessLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}
