"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import {
  Archive,
  Files,
  LayoutGrid,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();

  const user = useUser();
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={40} height={40} />
          <h2 className="text-xl font-bold text-slate-900">WhiteBord</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button>+ Create new Board</Button>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl mb-2">
            My Boards
          </SidebarGroupLabel>
          <SidebarMenuButton className="p-5" isActive={path === "/dashboard"}>
            <LayoutGrid />
            <span>All Files</span>
          </SidebarMenuButton>
          <SidebarMenuButton
            className="p-5 mt-2"
            isActive={path === "/shared-file"}
          >
            <Users />
            <span>Shared</span>
          </SidebarMenuButton>
          <SidebarMenuButton
            className="p-5 mt-2"
            isActive={path === "/archived"}
          >
            <Archive />
            <span>Archive</span>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarMenuButton className="p-5 mt-1" isActive={path === "/ai"}>
            <Sparkles />
            <span>Ai Helper</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-5 ">
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarGroup>

        <SidebarFooter>
          <Button>+ Create new Board</Button>
          <div
            className="p-4 my-3 border
           rounded-md"
          >
            <h2 className="text-sm flex  mb-1">2 files created</h2>
            <span>total 3</span>
            <Progress value={66} className="h-2 mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={user.user?.imageUrl ?? "/logo.svg"}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
            <h2>
              {user.user?.firstName} {user.user?.lastName}
            </h2>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
