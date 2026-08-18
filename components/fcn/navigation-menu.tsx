"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navigationData } from "@/app/navigation-data";
import { useTranslation } from "react-i18next";

//------------------------------

export function NavigationMenuBar() {
  //
  const { t } = useTranslation();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationData.navMain.map((item, index) => (
          <NavigationMenuItem
            key={`${item.title}-${index}`}
            className={item.components ? "hidden md:flex" : undefined}
          >
            {!item.components ? (
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href={item.url}>
                  <span className="flex items-center gap-2">
                    {item.icon && (
                      <span className="size-4 shrink-0">{item.icon}</span>
                    )}
                    {item.title}
                  </span>
                </Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>
                  <span className="flex items-center gap-2">
                    {item.icon && (
                      <span className="size-4 shrink-0">{item.icon}</span>
                    )}
                    {item.title}
                  </span>
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                    {item.components.map((component, componentIndex) => (
                      <ListItem
                        key={`${component.title}-${componentIndex}`}
                        title={t(component.title)}
                        href={component.url}
                      >
                        <div className="flex items-center gap-2">
                          {component.icon && (
                            <span className="size-4 shrink-0">
                              {component.icon}
                            </span>
                          )}
                          <span>{component.description}</span>
                        </div>
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
