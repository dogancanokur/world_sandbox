import { Separator } from "@/components/ui/separator";
import { NavigationMenuBar } from "@/components/fcn/navigation-menu";
import { LanguageSelector } from "@/components/fcn/language-selector";
import { CommandIcon } from "lucide-react";
import * as React from "react";

//------------------------------

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/*<SidebarTrigger className="-ml-1" />*/}
        <a href="#" className={"flex gap-1"}>
          <CommandIcon className="size-5!" />
          <span className="text-base font-semibold">
            {process.env.NEXT_PUBLIC_COMPANY_NAME}
          </span>
        </a>

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]"
        />
        <NavigationMenuBar />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]"
        />

        <LanguageSelector />
      </div>
    </header>
  );
}
