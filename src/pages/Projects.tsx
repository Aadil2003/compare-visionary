
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Link, useNavigate } from "react-router-dom";
import { Image, Search, Plus, Calendar, Activity, Clock, BarChart, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: projectsResponse, isLoading, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: () => apiClient.getProjects(),
  });

  const projects = projectsResponse?.data || [];

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    setIsDialogOpen(true);
  };

  const createProject = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required"
      });
      return;
    }

    try {
      setIsCreating(true);
      const response = await apiClient.createProject(projectName, projectDescription);
      
      toast({
        title: "Success!",
        description: "Project created successfully"
      });
      
      // Reset form and close dialog
      setIsDialogOpen(false);
      setProjectName("");
      setProjectDescription("");
      
      // Refresh projects list
      refetch();
      
      // Navigate to the new project
      navigate(`/projects/${response.data.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your visual testing projects
          </p>
        </div>
        <Button onClick={handleCreateProject} className="rounded-full gap-1.5">
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            className="pl-9 max-w-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="grid" className="mb-8">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          
          <p className="text-sm text-muted-foreground">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        
        <TabsContent value="grid" className="mt-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent className="pb-0 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Skeleton className="h-4 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              icon={<Image size={48} className="opacity-20" />}
              title="No projects found"
              description={searchQuery ? "Try adjusting your search query" : "Create your first project to get started"}
              action={
                <Button onClick={handleCreateProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              }
              className="py-16"
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden card-hover">
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Tests</span>
                        <span className="font-medium mt-1">{project.testCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Snapshots</span>
                        <span className="font-medium mt-1">{project.snapshots}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <Link 
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center rounded-full text-xs bg-primary text-primary-foreground h-7 px-3 py-1 hover:bg-primary/90 transition-colors"
                    >
                      <span className="mr-1">View</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          {isLoading ? (
            <div className="rounded-md border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`p-4 flex items-center gap-4 ${i !== 4 ? "border-b" : ""}`}>
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              icon={<Image size={48} className="opacity-20" />}
              title="No projects found"
              description={searchQuery ? "Try adjusting your search query" : "Create your first project to get started"}
              action={
                <Button onClick={handleCreateProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              }
              className="py-16"
            />
          ) : (
            <div className="rounded-md border overflow-hidden">
              {filteredProjects.map((project, i) => (
                <div 
                  key={project.id} 
                  className={`p-4 flex flex-col md:flex-row md:items-center gap-4 
                    ${i !== filteredProjects.length - 1 ? "border-b" : ""}
                    hover:bg-muted/50 transition-colors`}
                >
                  <div className="bg-secondary flex items-center justify-center h-10 w-10 rounded-md text-foreground/80 shrink-0">
                    <Image size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{project.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Activity size={12} /> {project.testCount} tests
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart size={12} /> {project.snapshots} snapshots
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/projects/${project.id}`}
                    className="md:self-center shrink-0 inline-flex items-center rounded-full text-xs bg-primary text-primary-foreground h-8 px-3 py-1 hover:bg-primary/90 transition-colors"
                  >
                    <span className="mr-1">View Project</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create project dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up a new visual testing project to start tracking UI changes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name" 
                placeholder="E.g., Company Website" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Brief description of your project" 
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={createProject} 
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Projects;
