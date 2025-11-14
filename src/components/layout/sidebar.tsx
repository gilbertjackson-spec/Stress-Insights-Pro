import { SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { LayoutDashboard, FileText, Settings, LifeBuoy, LogOut, BrainCircuit, Building } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary-foreground" />
            <div className="flex flex-col">
                <h2 className="text-lg font-headline font-semibold text-primary-foreground">Stress Insights</h2>
                <p className="text-xs text-sidebar-foreground/70">PRO</p>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin/companies" passHref>
              <SidebarMenuButton
                tooltip="Dashboard"
                isActive={pathname === "/" || pathname.startsWith("/admin/companies")}
                asChild
              >
                <div>
                  <LayoutDashboard />
                  Dashboard
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Reports"
              isActive={pathname.startsWith("/reports")}
            >
              <FileText />
              Reports
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Support">
                    <LifeBuoy />
                    Support
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" isActive={pathname.startsWith("/settings")}>
                    <Settings />
                    Settings
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout">
                    <LogOut />
                    Logout
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
