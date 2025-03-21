import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { PageLayout } from "@/components/layout/PageLayout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useState } from "react";
import { ChevronLeft, Copy, RefreshCw, Eye, BarChart, Clock, Info, CheckCircle, XCircle, AlertCircle, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [testsSection, setTestsSection] = useState<HTMLElement | null>(null);

  // Fetch project data
  const { data: projectResponse, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => apiClient.getProject(projectId!),
    enabled: !!projectId,
  });

  // Fetch project tests
  const { data: testsResponse, isLoading: isLoadingTests } = useQuery({
    queryKey: ["tests", projectId],
    queryFn: () => apiClient.getTests(projectId!),
    enabled: !!projectId,
  });

  const project = projectResponse?.data;
  const tests = testsResponse?.data || [];

  const handleRegenerateToken = async () => {
    try {
      if (!projectId) return;
      
      await apiClient.generateToken(projectId);
      toast.success("Token regenerated successfully");
      
      // Refetch project to get the new token
      const newProject = await apiClient.getProject(projectId);
      setTokenDialogOpen(false);
    } catch (error) {
      console.error("Failed to regenerate token:", error);
    }
  };

  const handleCopyToken = () => {
    if (!project) return;
    
    navigator.clipboard.writeText(project.token);
    toast.success("Token copied to clipboard");
  };

  const scrollToTests = () => {
    const testsSection = document.getElementById('tests-section');
    if (testsSection) {
      testsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Passed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-secondary text-foreground">
            {status}
          </Badge>
        );
    }
  };

  if (isLoadingProject) {
    return (
      <PageLayout>
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>

        <Skeleton className="h-8 w-40 mb-6" />
        <Skeleton className="h-96" />
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <EmptyState
          icon={<Info size={48} className="opacity-20" />}
          title="Project not found"
          description="The project you're looking for doesn't exist or you don't have access to it"
          action={
            <Button onClick={() => navigate("/projects")}>
              Back to Projects
            </Button>
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setTokenDialogOpen(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            API Token
          </Button>
          <Button 
            size="sm" 
            className="rounded-full"
            onClick={scrollToTests}
          >
            Go to Tests
          </Button>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-8">{project.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tests</CardTitle>
            <CardDescription>All test cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{project.testCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Snapshots</CardTitle>
            <CardDescription>Total snapshots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{project.snapshots}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Last Updated</CardTitle>
            <CardDescription>Activity status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {format(new Date(project.updatedAt), "MMM d, yyyy")}
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(project.updatedAt), "h:mm a")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8" id="tests-section">
        <h2 className="text-xl font-semibold mb-6">Recent Tests</h2>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
            <TabsTrigger value="passed">Passed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {isLoadingTests ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : tests.length === 0 ? (
              <EmptyState
                title="No tests found"
                description="This project doesn't have any tests yet"
                action={
                  <Button>
                    Run First Test
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                {tests.map((test) => (
                  <Card key={test.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium truncate">{test.name}</h3>
                          {getStatusBadge(test.status)}
                        </div>
                        <div className="grid grid-cols-2 sm:flex sm:gap-6 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <BarChart className="h-3 w-3" />
                            <span>{test.snapshotCount} snapshots</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(test.updatedAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/projects/${projectId}/tests/${test.id}`}
                          className="inline-flex items-center rounded text-xs bg-secondary text-foreground h-8 px-3 py-1 hover:bg-secondary/80 transition-colors"
                        >
                          View Results
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="failed" className="mt-0">
            {isLoadingTests ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tests
                  .filter((test) => test.status === "failed")
                  .map((test) => (
                    <Card key={test.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium truncate">{test.name}</h3>
                            {getStatusBadge(test.status)}
                          </div>
                          <div className="grid grid-cols-2 sm:flex sm:gap-6 mt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BarChart className="h-3 w-3" />
                              <span>{test.snapshotCount} snapshots</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(test.updatedAt), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${projectId}/tests/${test.id}`}
                            className="inline-flex items-center rounded text-xs bg-secondary text-foreground h-8 px-3 py-1 hover:bg-secondary/80 transition-colors"
                          >
                            View Results
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="passed" className="mt-0">
            {isLoadingTests ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tests
                  .filter((test) => test.status === "passed")
                  .map((test) => (
                    <Card key={test.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium truncate">{test.name}</h3>
                            {getStatusBadge(test.status)}
                          </div>
                          <div className="grid grid-cols-2 sm:flex sm:gap-6 mt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BarChart className="h-3 w-3" />
                              <span>{test.snapshotCount} snapshots</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(test.updatedAt), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${projectId}/tests/${test.id}`}
                            className="inline-flex items-center rounded text-xs bg-secondary text-foreground h-8 px-3 py-1 hover:bg-secondary/80 transition-colors"
                          >
                            View Results
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            {isLoadingTests ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {tests
                  .filter((test) => test.status === "pending")
                  .map((test) => (
                    <Card key={test.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium truncate">{test.name}</h3>
                            {getStatusBadge(test.status)}
                          </div>
                          <div className="grid grid-cols-2 sm:flex sm:gap-6 mt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BarChart className="h-3 w-3" />
                              <span>{test.snapshotCount} snapshots</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{format(new Date(test.updatedAt), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${projectId}/tests/${test.id}`}
                            className="inline-flex items-center rounded text-xs bg-secondary text-foreground h-8 px-3 py-1 hover:bg-secondary/80 transition-colors"
                          >
                            View Results
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API Token</DialogTitle>
            <DialogDescription>
              Use this token to authenticate API requests for this project
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-muted rounded-md">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm">{project.token}</div>
              <Button variant="ghost" size="icon" onClick={handleCopyToken}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <div className="text-xs text-muted-foreground">
              Created {format(new Date(project.createdAt), "MMM d, yyyy")}
            </div>
            <Button variant="outline" size="sm" onClick={handleRegenerateToken}>
              <RefreshCw className="h-3 w-3 mr-2" />
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ProjectDetail;
