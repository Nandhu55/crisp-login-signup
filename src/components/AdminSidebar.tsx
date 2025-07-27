import { 
  Home, 
  User, 
  LayoutDashboard, 
  BookOpen, 
  Book, 
  FileText, 
  Users, 
  FolderOpen,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", icon: Home, url: "#" },
  { title: "Profile", icon: User, url: "#" },
  { title: "Dashboard", icon: LayoutDashboard, url: "#", active: true },
  { title: "Manage Academic Books", icon: BookOpen, url: "#" },
  { title: "Manage Other Books", icon: Book, url: "#" },
  { title: "Manage Exam Papers", icon: FileText, url: "#" },
  { title: "Manage Users", icon: Users, url: "#" },
  { title: "Manage Categories", icon: FolderOpen, url: "#" },
];

export function AdminSidebar() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar className="w-64 border-r bg-white">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-blue-600">Admin Panel</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                      item.active ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : ""
                    }`}
                  >
                    <a href={item.url} className="flex items-center space-x-3 px-3 py-2">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            N
          </div>
          <div className="flex-1">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}