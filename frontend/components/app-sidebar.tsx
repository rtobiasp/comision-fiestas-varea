"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronRight,
  ChevronsUpDown,
  Images,
  LogOut,
  MoreHorizontal,
  Newspaper,
  PartyPopper,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const isNoticias = pathname.startsWith("/admin/noticias");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href="/admin">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <PartyPopper className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Comisión Varea
                    </span>
                    <span className="truncate text-xs">Panel gestión</span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Contenido</SidebarGroupLabel>
          <SidebarGroupAction title="Añadir contenido (prueba)">
            <Plus />
            <span className="sr-only">Añadir contenido</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* REAL: lleva a /admin/noticias de verdad */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isNoticias}
                  tooltip="Noticias"
                  render={
                    <Link href="/admin/noticias">
                      <Newspaper />
                      <span>Noticias</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>

              {/* PRUEBA: botón + acción + badge juntos */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Eventos (prueba)"
                  render={
                    <a href="#">
                      <CalendarDays />
                      <span>Eventos</span>
                    </a>
                  }
                />
                <SidebarMenuAction
                  showOnHover
                  title="Más opciones de eventos (prueba)"
                >
                  <MoreHorizontal />
                  <span className="sr-only">Más opciones de eventos</span>
                </SidebarMenuAction>
                <SidebarMenuBadge className="right-7">12</SidebarMenuBadge>
              </SidebarMenuItem>

              {/* PRUEBA: desplegable con submenú */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton tooltip="Programas (prueba)">
                        <Images />
                        <span>Programas</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    }
                  />
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive
                          render={
                            <a href="#">
                              <span>Programa 2025</span>
                            </a>
                          }
                        />
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          render={
                            <a href="#">
                              <span>Carteles</span>
                            </a>
                          }
                        />
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            {/* PRUEBA: grupo simple sin label */}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Miembros (prueba)"
                render={
                  <a href="#">
                    <Users />
                    <span>Miembros</span>
                  </a>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Ajustes (prueba)"
                render={
                  <a href="#">
                    <Settings />
                    <span>Ajustes</span>
                  </a>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" tooltip="Rubén García (prueba)">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-semibold">
                      RG
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Rubén García</span>
                      <span className="truncate text-xs">admin@varea.test</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
                className="min-w-56 rounded-lg"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-xs font-semibold">
                        RG
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">Rubén García</span>
                        <span className="truncate text-xs">admin@varea.test</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {/* PRUEBA: sin auth real todavía (fase 03 OIDC/RBAC), solo menú visual */}
                <DropdownMenuItem variant="destructive">
                  <LogOut />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
