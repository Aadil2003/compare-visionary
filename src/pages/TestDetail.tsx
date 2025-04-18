
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { PageLayout } from "@/components/layout/PageLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { CompareSlider } from "@/components/ui/compare-slider";
import { toast } from "sonner";
import { ChevronLeft, Info, CheckCircle, XCircle, AlertCircle, Monitor, CheckIcon, XIcon, Eye, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { isSignificantChange } from "@/utils/imageComparison";

const TestDetail = () => {
  const { projectId, testId } = useParams<{ projectId: string; testId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [processedSnapshots, setProcessedSnapshots] = useState<Record<string, { diffImageUrl?: string; diffPercentage?: number }>>({});
  const [activeComparisonMode, setActiveComparisonMode] = useState<string | null>(null);

  // Fetch test data
  const { data: testResponse, isLoading: isLoadingTest } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => apiClient.getTest(testId!),
    enabled: !!testId,
  });

  // Fetch snapshots
  const { data: snapshotsResponse, isLoading: isLoadingSnapshots } = useQuery({
    queryKey: ["snapshots", testId],
    queryFn: () => apiClient.getSnapshots(testId!),
    enabled: !!testId,
  });

  // Mutations for approving and rejecting snapshots
  const approveMutation = useMutation({
    mutationFn: (snapshotId: string) => apiClient.approveSnapshot(snapshotId),
    onSuccess: (data) => {
      toast.success("Snapshot approved");
      queryClient.invalidateQueries({ queryKey: ["snapshots", testId] });
      queryClient.invalidateQueries({ queryKey: ["test", testId] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (snapshotId: string) => apiClient.rejectSnapshot(snapshotId),
    onSuccess: (data) => {
      toast.error("Snapshot rejected");
      queryClient.invalidateQueries({ queryKey: ["snapshots", testId] });
      queryClient.invalidateQueries({ queryKey: ["test", testId] });
    }
  });

  const setAsBaselineMutation = useMutation({
    mutationFn: (snapshotId: string) => apiClient.setAsBaseline(snapshotId),
    onSuccess: (data) => {
      toast.success("Snapshot set as baseline");
      queryClient.invalidateQueries({ queryKey: ["snapshots", testId] });
      queryClient.invalidateQueries({ queryKey: ["test", testId] });
    }
  });

  const test = testResponse?.data;
  const snapshots = snapshotsResponse?.data || [];

  // Process snapshots to generate diff images using resemble.js
  useEffect(() => {
    const processSnapshotImages = async () => {
      if (activeComparisonMode) return; // Don't process if actively comparing
      
      const newProcessedSnapshots: Record<string, { diffImageUrl?: string; diffPercentage?: number }> = {};
      
      for (const snapshot of snapshots) {
        // Only perform comparison if there's both a baseline and current image
        if (snapshot.baselineUrl && snapshot.currentUrl) {
          try {
            // Only generate diff if not already available
            if (!snapshot.diffUrl) {
              const { diffImageUrl, diffPercentage } = await apiClient.compareSnapshotImages(
                snapshot.baselineUrl,
                snapshot.currentUrl
              );
              
              newProcessedSnapshots[snapshot.id] = { 
                diffImageUrl,
                diffPercentage
              };
            }
          } catch (error) {
            console.error(`Error processing snapshot ${snapshot.id}:`, error);
          }
        }
      }
      
      setProcessedSnapshots(prev => ({ ...prev, ...newProcessedSnapshots }));
    };
    
    if (snapshots.length > 0) {
      processSnapshotImages();
    }
  }, [snapshots, activeComparisonMode]);

  // Handler for running a comparison with different options
  const handleCompare = async (snapshotId: string, mode: string) => {
    const snapshot = snapshots.find(s => s.id === snapshotId);
    if (!snapshot || !snapshot.baselineUrl || !snapshot.currentUrl) return;
    
    setActiveComparisonMode(snapshotId + mode);
    
    try {
      toast.info(`Running ${mode} comparison...`);
      
      const result = await apiClient.compareSnapshotImages(
        snapshot.baselineUrl,
        snapshot.currentUrl
      );
      
      setProcessedSnapshots(prev => ({
        ...prev,
        [snapshotId]: {
          diffImageUrl: result.diffImageUrl,
          diffPercentage: result.diffPercentage
        }
      }));
      
      toast.success(`${mode} comparison complete`);
    } catch (error) {
      console.error(`Error during ${mode} comparison:`, error);
      toast.error(`Failed to run ${mode} comparison`);
    } finally {
      setActiveComparisonMode(null);
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      case "failed":
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "new":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <Info className="h-3 w-3 mr-1" />
            New
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

  const handleApproveSnapshot = (snapshotId: string) => {
    approveMutation.mutate(snapshotId);
  };

  const handleRejectSnapshot = (snapshotId: string) => {
    rejectMutation.mutate(snapshotId);
  };

  const handleSetAsBaseline = (snapshotId: string) => {
    setAsBaselineMutation.mutate(snapshotId);
  };

  if (isLoadingTest) {
    return (
      <PageLayout>
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-4 w-96 mb-8" />

        <Skeleton className="h-80 mb-8" />

        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </PageLayout>
    );
  }

  if (!test) {
    return (
      <PageLayout>
        <EmptyState
          icon={<Info size={48} className="opacity-20" />}
          title="Test not found"
          description="The test you're looking for doesn't exist or you don't have access to it"
          action={
            <Button onClick={() => navigate(`/projects/${projectId}`)}>
              Back to Project
            </Button>
          }
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{test.name}</h1>
        {getStatusBadge(test.status)}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <div className="flex items-center gap-1">
          <Monitor className="h-4 w-4" />
          <span>{test.browser}</span>
        </div>
        <span>•</span>
        <span>{test.viewport}</span>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            {test.status === "passed" ? "All snapshots match the baseline" : 
             test.status === "failed" ? "Some snapshots don't match the baseline" :
             "Test is still running or waiting for review"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
              <div className="text-4xl font-bold">{test.snapshotCount}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Snapshots</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-md">
              <div className="text-4xl font-bold text-green-600">
                {snapshots.filter(s => s.status === "approved").length}
              </div>
              <div className="text-sm text-green-600/80 mt-1">Approved</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-md">
              <div className="text-4xl font-bold text-red-600">
                {snapshots.filter(s => ["failed", "rejected"].includes(s.status)).length}
              </div>
              <div className="text-sm text-red-600/80 mt-1">Failed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-6">Snapshots</h2>
      
      {isLoadingSnapshots ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : snapshots.length === 0 ? (
        <EmptyState
          title="No snapshots found"
          description="This test doesn't have any snapshots yet"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {snapshots.map((snapshot) => {
            // Determine which diff info to use - from the API or generated locally
            const effectiveDiffUrl = 
              snapshot.diffUrl || 
              (processedSnapshots[snapshot.id]?.diffImageUrl);
              
            const effectiveDiffPercentage = 
              snapshot.diffPercentage !== null ? 
              snapshot.diffPercentage : 
              processedSnapshots[snapshot.id]?.diffPercentage;

            const isComparing = activeComparisonMode === snapshot.id + "standard";

            return (
              <Card key={snapshot.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{snapshot.name}</CardTitle>
                    {getStatusBadge(snapshot.status)}
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Monitor className="h-3 w-3" />
                    {snapshot.browser} ({snapshot.viewport})
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  {effectiveDiffUrl && snapshot.baselineUrl ? (
                    <CompareSlider
                      beforeImage={snapshot.baselineUrl}
                      afterImage={snapshot.currentUrl}
                      className="mb-4"
                      diffPercentage={effectiveDiffPercentage || 0}
                      diffImageUrl={effectiveDiffUrl}
                    />
                  ) : snapshot.baselineUrl ? (
                    <img 
                      src={snapshot.currentUrl} 
                      alt={snapshot.name}
                      className="w-full h-auto rounded-md mb-4"
                    />
                  ) : (
                    <div className="relative">
                      <img 
                        src={snapshot.currentUrl} 
                        alt={snapshot.name}
                        className="w-full h-auto rounded-md mb-4"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-500">New</Badge>
                    </div>
                  )}
                  
                  {effectiveDiffPercentage !== undefined && effectiveDiffPercentage !== null && (
                    <div className="mb-4">
                      <div className="text-sm font-medium">Difference</div>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`text-lg font-semibold ${
                            isSignificantChange(effectiveDiffPercentage) ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {effectiveDiffPercentage.toFixed(2)}%
                        </div>
                        {isSignificantChange(effectiveDiffPercentage) ? (
                          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                            Significant change
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            Minor change
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Image comparison options - only show if both baseline and current exist */}
                  {snapshot.baselineUrl && snapshot.currentUrl && (
                    <div className="flex items-center gap-2 mb-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCompare(snapshot.id, "standard")}
                        disabled={isComparing}
                        className="flex-1 text-xs"
                      >
                        {isComparing ? (
                          <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Eye className="h-3 w-3 mr-1" />
                        )}
                        Recompare
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {(["failed", "new", "pending"].includes(snapshot.status)) && (
                      <>
                        <Button 
                          variant="outline" 
                          className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                          onClick={() => handleApproveSnapshot(snapshot.id)}
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                          onClick={() => handleRejectSnapshot(snapshot.id)}
                        >
                          <XIcon className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {snapshot.status === "approved" && (
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSetAsBaseline(snapshot.id)}
                      >
                        Set as Baseline
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageLayout>
  );
};

export default TestDetail;
