import { DocumentContent } from './DocumentContent';
import { DocumentHeader } from './DocumentHeader';
import { DocumentToolbar } from './DocumentToolbar';
import { StatusBar } from './StatusBar';

interface MainContentProps {
  onShare: (title: string) => void;
}

/** Right column: the open document (toolbar, header, body) and the status bar. */
export function MainContent({ onShare }: MainContentProps) {
  return (
    <main className="flex-1 bg-white overflow-y-auto flex flex-col justify-between relative tech-grid">
      {/* Centered reading column */}
      <div className="p-6 max-w-4xl w-full mx-auto space-y-6">
        <DocumentToolbar onShare={onShare} />
        <DocumentHeader />
        <DocumentContent />
      </div>

      <StatusBar />
    </main>
  );
}
