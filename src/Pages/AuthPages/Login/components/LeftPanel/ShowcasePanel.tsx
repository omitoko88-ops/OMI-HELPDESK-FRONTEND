import type { LogEntry } from '../../types';
import { BrandHeader } from './BrandHeader';
import { CircuitPattern } from './CircuitPattern';
import { ShowcaseFooter } from './ShowcaseFooter';
import { TerminalConsole } from './TerminalConsole';

interface ShowcasePanelProps {
  logs: LogEntry[];
  onCommand: (command: string) => void;
  onTrivia: () => void;
}

/** Panel kiri: branding + terminal interaktif. */
export function ShowcasePanel({ logs, onCommand, onTrivia }: ShowcasePanelProps) {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden border-b border-slate-300 bg-linear-to-br from-slate-100 to-slate-200/80 p-8 lg:col-span-5 lg:border-r lg:border-b-0">
      <CircuitPattern />
      <BrandHeader />
      <TerminalConsole logs={logs} onCommand={onCommand} />
      <ShowcaseFooter onTrivia={onTrivia} />
    </div>
  );
}
