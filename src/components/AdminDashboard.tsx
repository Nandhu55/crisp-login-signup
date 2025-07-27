import { Users, BookOpen, Book, FileText, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statsCards = [
  { title: "Total Users", value: "6", icon: Users },
  { title: "Academic Books", value: "4", icon: BookOpen },
  { title: "Other Books", value: "1", icon: Book },
  { title: "Exam Papers", value: "6", icon: FileText },
  { title: "Categories", value: "4", icon: FolderOpen },
];

const quickLinks = [
  {
    title: "Manage Academic Books",
    description: "View, upload, and delete course-related books.",
    icon: BookOpen,
  },
  {
    title: "Manage Other Books",
    description: "Manage finance, motivation, and other books.",
    icon: Book,
  },
  {
    title: "Manage Exam Papers",
    description: "Upload and manage past exam question papers.",
    icon: FileText,
  },
  {
    title: "Manage Users",
    description: "View and manage registered student accounts.",
    icon: Users,
  },
];

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Dashboard Overview */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">A quick glance at your library's stats.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsCards.map((stat) => (
            <Card key={stat.title} className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quick Links</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Card key={link.title} className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <link.icon className="w-5 h-5 text-blue-600" />
                  <span>{link.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{link.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}