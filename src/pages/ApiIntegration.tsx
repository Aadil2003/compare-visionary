import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/services/api";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, CheckCircle, RefreshCw, AlertCircle, Code, Terminal } from "lucide-react";
import { toast } from "sonner";

const ApiIntegration = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  
  const { data: projectResponse, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => apiClient.getProject(projectId!),
    enabled: !!projectId,
  });

  const { mutate: regenerateToken, isPending } = useMutation({
    mutationFn: () => apiClient.generateToken(projectId!),
    onSuccess: (data) => {
      toast.success("New token generated successfully");
    },
  });

  const project = projectResponse?.data;
  
  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    toast.success(`${item} copied to clipboard`);
    
    setTimeout(() => {
      setCopiedItem(null);
    }, 3000);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-full max-w-2xl mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Project not found. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </PageLayout>
    );
  }

  const nodeJsExample = `
// Install the Visually SDK: npm install @visually/sdk --save-dev

const { visualize } = require('@visually/sdk');

// Configure the SDK in your test setup
visualize.configure({
  projectToken: '${project.token}',
  apiUrl: 'https://api.visually.dev',
});

// Use in your tests
describe('Homepage', () => {
  it('should display correctly', async () => {
    await page.goto('https://example.com');
    await visualize('homepage');
  });
});`;

  const cypressExample = `
// cypress/plugins/index.js
const { configureVisually } = require('@visually/sdk/cypress');

module.exports = (on, config) => {
  configureVisually(on, config, {
    projectToken: '${project.token}',
  });
  return config;
};

// In your test files
cy.visit('/');
cy.get('#content').should('be.visible');
cy.visualize('homepage');`;

  const playwrightExample = `
// playwright.config.js
const { configureVisually } = require('@visually/sdk/playwright');

module.exports = {
  globalSetup: async () => {
    await configureVisually({
      projectToken: '${project.token}',
    });
  },
};

// In your test files
const { visualize } = require('@visually/sdk/playwright');

test('homepage visual test', async ({ page }) => {
  await page.goto('https://example.com');
  await visualize(page, 'homepage');
});`;

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{project.name}: API Integration</h1>
      <p className="text-muted-foreground mb-8">
        Use these instructions to integrate Visually with your test suite
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Project Token</CardTitle>
            <CardDescription>Used to authenticate with the API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                value={project.token}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(project.token, "Token")}
              >
                {copiedItem === "Token" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => regenerateToken()}
              disabled={isPending}
            >
              <RefreshCw className={`h-3 w-3 mr-2 ${isPending ? 'animate-spin' : ''}`} />
              Regenerate Token
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Project Status</CardTitle>
            <CardDescription>Current project metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Tests</div>
                <div className="text-xl font-semibold">{project.testCount}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Snapshots</div>
                <div className="text-xl font-semibold">{project.snapshots}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">API Endpoints</CardTitle>
            <CardDescription>Available API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white">POST</Badge>
                <span className="font-mono">/v1/snapshots</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500 text-white">GET</Badge>
                <span className="font-mono">/v1/snapshots/{"{id}"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500 text-white">PUT</Badge>
                <span className="font-mono">/v1/snapshots/{"{id}"}/approve</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
          <CardDescription>
            Follow these steps to integrate Visually with your testing framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="nodejs">
            <TabsList className="mb-4">
              <TabsTrigger value="nodejs">Node.js</TabsTrigger>
              <TabsTrigger value="cypress">Cypress</TabsTrigger>
              <TabsTrigger value="playwright">Playwright</TabsTrigger>
            </TabsList>

            <TabsContent value="nodejs">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                  <code>{nodeJsExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(nodeJsExample, "NodeJS")}
                >
                  {copiedItem === "NodeJS" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="cypress">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                  <code>{cypressExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(cypressExample, "Cypress")}
                >
                  {copiedItem === "Cypress" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="playwright">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                  <code>{playwrightExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(playwrightExample, "Playwright")}
                >
                  {copiedItem === "Playwright" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>SDK Installation</AlertTitle>
            <AlertDescription>
              Install the Visually SDK using npm, yarn, or pnpm:
              <div className="mt-2 bg-muted p-2 rounded-md font-mono text-sm">
                npm install @visually/sdk --save-dev
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Reference</CardTitle>
          <CardDescription>
            Complete SDK and API documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Methods</h3>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-1">visualize(name, options)</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  Captures a screenshot of the current page and uploads it for comparison.
                </p>
                <div className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-xs">
                  <code>{`await visualize('homepage', {
  element: '#content',  // Optional: Capture a specific element
  ignoreRegions: [     // Optional: Ignore dynamic regions
    { x: 10, y: 10, width: 100, height: 50 }
  ],
  viewports: ['mobile'] // Optional: Override default viewports
});`}</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Configuration</h3>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-1">configure(options)</h4>
                <p className="text-muted-foreground text-sm mb-3">
                  Override default configuration at runtime.
                </p>
                <div className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-xs">
                  <code>{`configure({
  diffThreshold: 0.1,  // Percentage difference to trigger a failure
  screenshotDelay: 100, // Wait before capturing screenshot
  requestTimeout: 30000 // API request timeout in ms
});`}</code>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <Code className="h-4 w-4" />
              <span>View Full API Documentation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default ApiIntegration;
