import { Suspense } from 'react';
import CoverLetterPrint from './CoverLetterPrint';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <CoverLetterPrint />
    </Suspense>
  );
}
