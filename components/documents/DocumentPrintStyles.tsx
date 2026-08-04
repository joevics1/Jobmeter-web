'use client';

// Print styles shared by every screen that needs a "Download PDF" button
// (window.print() scoped to a #doc-print-area div). Safe to render on
// multiple screens since only one is ever mounted at a time.
export default function DocumentPrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        body * { visibility: hidden; }
        #doc-print-area, #doc-print-area * { visibility: visible; }
        #doc-print-area { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
        .no-print { display: none !important; }
      }
    `}</style>
  );
}
