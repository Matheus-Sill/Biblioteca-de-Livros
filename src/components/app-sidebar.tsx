import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import { NotebookPenIcon } from "lucide-react"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserButton showName/>
      </SidebarFooter>
    </Sidebar>
  )
}