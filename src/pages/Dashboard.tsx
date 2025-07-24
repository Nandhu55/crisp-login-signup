import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Heart, MessageCircle, Share2, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    first_name?: string;
    last_name?: string;
    username?: string;
    avatar_url?: string;
    course?: string;
  };
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "general" });
  const [isCreating, setIsCreating] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [user, navigate]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!posts_user_id_fkey (
            first_name,
            last_name,
            username,
            avatar_url,
            course
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data as Post[] || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    }
  };

  const createPost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
        });

      if (error) throw error;

      setNewPost({ title: "", content: "", category: "general" });
      setShowCreatePost(false);
      fetchPosts();
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">B-Tech Hub</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowCreatePost(!showCreatePost)}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Post
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
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create Post Form */}
          {showCreatePost && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Create a New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[100px] bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                />
                <div className="flex items-center justify-between">
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General</option>
                    <option value="academics">Academics</option>
                    <option value="projects">Projects</option>
                    <option value="internships">Internships</option>
                    <option value="placement">Placement</option>
                  </select>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreatePost(false)}
                      className="border-border text-foreground hover:bg-secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createPost}
                      disabled={isCreating || !newPost.title.trim() || !newPost.content.trim()}
                      className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
                    >
                      {isCreating ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 ? (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No posts yet. Be the first to share something with the community!
                  </p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="border-border bg-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.profiles?.avatar_url} />
                          <AvatarFallback>
                            {post.profiles?.first_name?.[0] || post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {post.profiles?.first_name && post.profiles?.last_name
                              ? `${post.profiles.first_name} ${post.profiles.last_name}`
                              : post.profiles?.username || 'Anonymous'}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{formatDate(post.created_at)}</span>
                            {post.profiles?.course && (
                              <>
                                <span>•</span>
                                <span>{post.profiles.course}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        {post.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                    <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>
                    
                    <div className="flex items-center space-x-6 text-muted-foreground">
                      <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes_count}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments_count}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;