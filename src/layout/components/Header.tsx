// src/components/layout/Header.tsx
import { ErrorAlert } from "@/components/common/CustomErrorAlert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useVersion } from "@/hooks/api/useVersion";
import { Version } from "@/interfaces/Version";
import { ApiError } from "@/lib/ApiError";
import { useActiveVersion } from "@/stores/versionStore";
import { ArrowDown, Check, ChevronDown, Menu, X } from "lucide-react";
import { useEffect } from "react";

export default function Header() {
  const { setVersion } = useActiveVersion();
  const {
    data: listVersion,
    isLoading: versionLoading,
    isFetching: versionFetching,
    isError,
    error,
  } = useVersion();
  useEffect(() => {
    if (listVersion) setVersion(listVersion[0].version);
  }, [listVersion]);
  return (
    <header className="fixed w-full h-17 border-b flex items-center justify-center px-6 z-50 bg-navbg/70 backdrop-blur-md">
      {isError && error instanceof ApiError && <ErrorAlert error={error} />}
      <div className="max-w-[1540px] w-full flex items-center justify-between">
        <div className="text-2xl font-bold">Documentation</div>

        <div className="flex justify-center items-center gap-6 text-sm">
          {versionLoading || versionFetching ? (
            <Skeleton className="w-25 h-8 border-2 rounded-xl" />
          ) : (
            <DropdownVersion listVersion={listVersion ?? []} />
          )}

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
            <input
              type="text"
              placeholder="Search documentation..."
              className="ml-4 px-3 py-1 border rounded-md text-sm"
            />
          </nav>
        </div>

        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </div>
    </header>
  );
}

const SidebarToggle = () => {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpenMobile(!openMobile)}
      className="md:hidden"
    >
      {openMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </Button>
  );
};

function DropdownVersion({ listVersion }: { listVersion: Version[] }) {
  const { setVersion, version } = useActiveVersion();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full h-12 outline-0">
        <div className="flex gap-2 items-center cursor-pointer">
          <div className="hover:underline">Versions</div>
          <div>
            {version ? (
              <Badge>{version}</Badge>
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-25">
        {listVersion?.map((data) => (
          <DropdownMenuItem
            key={data.id}
            className={`flex justify-between items-center gap-4 ${
              version === data.version ? `bg-muted` : ``
            }`}
            onClick={() => setVersion(data.version)}
          >
            v{data.version}
            {version === data.version && <Check />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
