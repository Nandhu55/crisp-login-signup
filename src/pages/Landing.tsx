import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandHeader } from "@/components/ui/brand-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search, FileText, Users, Lightbulb, Briefcase, ArrowRight } from "lucide-react";
import digitalLibraryHero from "@/assets/digital-library-hero.jpg";

const Landing = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Vast Library Collection",
      description: "Access thousands of academic books, textbooks, and reference materials across all B.Tech disciplines."
    },
    {
      icon: Search,
      title: "AI-Powered Search",
      description: "Find exactly what you need with our intelligent search that understands context and recommendations."
    },
    {
      icon: FileText,
      title: "Past Exam Papers",
      description: "Download previous year question papers and solutions to prepare effectively for your exams."
    },
    {
      icon: Users,
      title: "Study Groups",
      description: "Connect with fellow students, form study groups, and collaborate on projects and assignments."
    },
    {
      icon: Lightbulb,
      title: "Smart Recommendations",
      description: "Get personalized book and resource recommendations based on your course, year, and interests."
    },
    {
      icon: Briefcase,
      title: "Career Resources",
      description: "Access interview preparation materials, placement guides, and career development resources."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Academic Books", sublabel: "Comprehensive collection" },
    { number: "5,000+", label: "Past Papers", sublabel: "Previous year questions" },
    { number: "50,000+", label: "Students", sublabel: "Active learners" },
    { number: "100+", label: "Universities", sublabel: "Curriculum covered" }
  ];

  const testimonials = [
    {
      quote: "B-Tech Hub completely transformed my study routine. The AI recommendations helped me find the perfect resources for my projects.",
      name: "Priya Sharma",
      course: "Computer Science Engineering • Final Year"
    },
    {
      quote: "The past paper collection is incredible! I improved my exam scores significantly after using this platform.",
      name: "Rahul Kumar",
      course: "Electronics & Communication • 3rd Year"
    },
    {
      quote: "Love the study groups feature. Found amazing study partners and we help each other with assignments regularly.",
      name: "Ananya Patel",
      course: "Mechanical Engineering • 2nd Year"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">B-Tech Hub</span>
          </div>
          <Button asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="w-fit">
                AI-Powered Learning
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground">
                  Your Digital Library,{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Reimagined
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Access a vast collection of academic books, past exam papers, and career resources. 
                  All powered by AI to help you study smarter.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
                  <Link to="/auth">
                    Login & Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="#features">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img 
                src={digitalLibraryHero} 
                alt="Digital Library Platform" 
                className="w-full h-auto rounded-2xl shadow-glow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Everything You Need to Excel</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive academic resources powered by AI to enhance your learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Trusted by Thousands</h2>
            <p className="text-xl text-muted-foreground">
              Join the growing community of successful students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-foreground">{stat.label}</div>
                <div className="text-muted-foreground">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">What Students Say</h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from students who've transformed their learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <p className="text-foreground italic">"{testimonial.quote}"</p>
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.course}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-foreground">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who are already using B-Tech Hub to excel in their academic journey.
          </p>
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90">
            <Link to="/auth">
              Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">B-Tech Hub</span>
          </div>
          <p className="text-muted-foreground">
            Your gateway to academic excellence and community learning.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;