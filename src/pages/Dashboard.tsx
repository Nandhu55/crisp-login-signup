import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, Search, FileText, Users, Download, Star, 
  TrendingUp, Clock, User, LogOut, Bell, Settings,
  GraduationCap, Bookmark, Filter, Grid, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Mock data for demonstration
  const quickStats = [
    { label: "Books Read", value: "24", icon: BookOpen, color: "text-blue-500" },
    { label: "Papers Downloaded", value: "156", icon: FileText, color: "text-green-500" },
    { label: "Study Hours", value: "89", icon: Clock, color: "text-purple-500" },
    { label: "Rank", value: "#12", icon: TrendingUp, color: "text-orange-500" },
  ];

  const recentBooks = [
    {
      id: 1,
      title: "Data Structures and Algorithms",
      author: "Thomas H. Cormen",
      subject: "Computer Science",
      rating: 4.8,
      downloads: 1234,
      pages: 1312,
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Digital Electronics",
      author: "Morris Mano",
      subject: "Electronics",
      rating: 4.6,
      downloads: 892,
      pages: 456,
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Engineering Mathematics",
      author: "B.S. Grewal",
      subject: "Mathematics",
      rating: 4.9,
      downloads: 2156,
      pages: 1200,
      cover: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=200&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Operating Systems",
      author: "Abraham Silberschatz",
      subject: "Computer Science",
      rating: 4.7,
      downloads: 967,
      pages: 944,
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop"
    }
  ];

  const examPapers = [
    {
      id: 1,
      title: "Computer Networks - Mid Semester",
      year: "2023",
      semester: "6th",
      branch: "CSE",
      downloads: 245
    },
    {
      id: 2,
      title: "Database Management - End Semester",
      year: "2023",
      semester: "5th",
      branch: "CSE",
      downloads: 189
    },
    {
      id: 3,
      title: "Digital Signal Processing - Mid Semester",
      year: "2023",
      semester: "6th",
      branch: "ECE",
      downloads: 167
    }
  ];

  const studyGroups = [
    {
      id: 1,
      name: "Data Structures Study Group",
      members: 24,
      subject: "Computer Science",
      nextSession: "Today, 7:00 PM"
    },
    {
      id: 2,
      name: "Digital Electronics Lab",
      members: 18,
      subject: "Electronics",
      nextSession: "Tomorrow, 2:00 PM"
    },
    {
      id: 3,
      name: "Engineering Math Prep",
      members: 31,
      subject: "Mathematics",
      nextSession: "Wed, 6:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">B-Tech Hub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search books, papers, resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-80 bg-background/50"
                />
              </div>
              
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0]}!
          </h2>
          <p className="text-muted-foreground">
            Continue your learning journey with our vast collection of academic resources.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-border bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="library" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="papers">Exam Papers</TabsTrigger>
            <TabsTrigger value="groups">Study Groups</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Academic Library</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
              {recentBooks.map((book) => (
                <Card key={book.id} className="border-border bg-card hover:shadow-lg transition-all duration-200 group">
                  <CardContent className={viewMode === "grid" ? "p-4" : "p-4 flex items-center space-x-4"}>
                    <div className={viewMode === "grid" ? "space-y-3" : "flex-shrink-0"}>
                      <img
                        src={book.cover}
                        alt={book.title}
                        className={`rounded-md object-cover ${viewMode === "grid" ? "w-full h-48" : "w-20 h-28"}`}
                      />
                    </div>
                    <div className={viewMode === "grid" ? "space-y-2" : "flex-1 space-y-1"}>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                      <Badge variant="secondary" className="text-xs">
                        {book.subject}
                      </Badge>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{book.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{book.downloads}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                          Read Now
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="papers" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Past Exam Papers</h3>
              <Button className="bg-gradient-primary hover:opacity-90">
                Upload Paper
              </Button>
            </div>

            <div className="grid gap-4">
              {examPapers.map((paper) => (
                <Card key={paper.id} className="border-border bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">{paper.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Year: {paper.year}</span>
                          <span>•</span>
                          <span>Semester: {paper.semester}</span>
                          <span>•</span>
                          <span>Branch: {paper.branch}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-muted-foreground">
                          {paper.downloads} downloads
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">Study Groups</h3>
              <Button className="bg-gradient-primary hover:opacity-90">
                Create Group
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGroups.map((group) => (
                <Card key={group.id} className="border-border bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground">{group.name}</h4>
                        <p className="text-sm text-muted-foreground">{group.subject}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{group.members} members</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Next session:</p>
                        <p className="text-sm font-medium text-foreground">{group.nextSession}</p>
                      </div>
                      <Button className="w-full" variant="outline">
                        Join Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-lg">
                      {user?.user_metadata?.first_name?.[0] || user?.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {user?.user_metadata?.first_name && user?.user_metadata?.last_name
                        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                        : user?.email}
                    </h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Button size="sm" variant="outline">
                      Edit Profile
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Course</label>
                    <Input placeholder="B.Tech Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Year</label>
                    <Input placeholder="3rd Year" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">University</label>
                    <Input placeholder="University Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Roll Number</label>
                    <Input placeholder="12345678" />
                  </div>
                </div>
                
                <Button className="bg-gradient-primary hover:opacity-90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;