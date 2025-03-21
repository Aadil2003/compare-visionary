
import { PageLayout } from "@/components/layout/PageLayout";
import { MetricCard } from "@/components/ui/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, LineChart, PieChart, Activity, Image, CheckCircle, XCircle, Clock } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const WelcomeCard = () => (
  <Card className="col-span-full mb-6 bg-primary text-primary-foreground overflow-hidden relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 to-transparent"></div>
    <CardHeader className="pb-0">
      <CardTitle className="text-2xl lg:text-3xl font-medium">Welcome to Visually</CardTitle>
      <CardDescription className="text-primary-foreground/80 max-w-2xl">
        Track, manage, and approve visual changes across your web applications. Detect
        visual regressions before they reach production.
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Link 
          to="/projects"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary-foreground text-primary h-10 px-4 py-2 shadow-sm transition-colors hover:bg-primary-foreground/90"
        >
          View Projects
        </Link>
        <Link 
          to="/docs"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 h-10 px-4 py-2 transition-colors hover:bg-primary-foreground/20"
        >
          Read Documentation
        </Link>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiClient.getProjects(),
  });

  // Demo toast
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("New snapshot detected in E-commerce project", {
        description: "Homepage header has visual changes",
        action: {
          label: "View",
          onClick: () => {},
        },
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate summary stats
  const totalTests = projects?.data.reduce((acc, project) => acc + project.testCount, 0) || 0;
  const totalSnapshots = projects?.data.reduce((acc, project) => acc + project.snapshots, 0) || 0;
  
  // Most recent project
  const recentProject = projects?.data.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0];

  return (
    <PageLayout>
      <WelcomeCard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          title="Total Projects" 
          value={isLoading ? "-" : projects?.data.length || 0}
          icon={<Image size={18} />} 
          trend={{ value: "2 new", isPositive: true }}
        />
        <MetricCard 
          title="Total Tests" 
          value={isLoading ? "-" : totalTests}
          icon={<Activity size={18} />} 
          trend={{ value: "12 new", isPositive: true }}
        />
        <MetricCard 
          title="Passed" 
          value={isLoading ? "-" : "86%"}
          icon={<CheckCircle size={18} />} 
          trend={{ value: "2.4%", isPositive: true }}
        />
        <MetricCard 
          title="Failed" 
          value={isLoading ? "-" : "14%"}
          icon={<XCircle size={18} />} 
          trend={{ value: "0.3%", isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Test Activity</CardTitle>
            <CardDescription>Test runs over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <div className="h-[240px] flex items-center justify-center">
                <LineChart className="h-full w-full text-muted-foreground/50" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Snapshot Status</CardTitle>
            <CardDescription>Current snapshot distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <div className="h-[240px] flex items-center justify-center">
                <PieChart className="h-full w-full text-muted-foreground/50" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your recently updated projects</CardDescription>
              </div>
              <Link
                to="/projects"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="failed">Failed Tests</TabsTrigger>
                <TabsTrigger value="pending">Pending Review</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="m-0">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-3 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects?.data.slice(0, 5).map((project) => (
                      <Link 
                        key={project.id} 
                        to={`/projects/${project.id}`}
                        className="flex items-start gap-4 p-3 rounded-md hover:bg-muted transition-colors"
                      >
                        <div className="bg-secondary flex items-center justify-center h-12 w-12 rounded-md text-foreground/80">
                          <Image size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Activity size={12} /> {project.testCount} tests
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="failed" className="m-0">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No failed tests at the moment</p>
                </div>
              </TabsContent>
              <TabsContent value="pending" className="m-0">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending reviews</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
