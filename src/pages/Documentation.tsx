
import { PageLayout } from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Terminal, Code, Server, Database, Lock, ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DocumentationPage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`${label} copied to clipboard`);
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Documentation</h1>
          <p className="text-xl text-muted-foreground">
            Learn how to integrate and use Visually with your testing workflow
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="mb-12">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="api">API Reference</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="getting-started" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
                <CardDescription>
                  Visually is a visual testing tool that helps you detect visual regressions in your web applications.
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-foreground">
                <p>
                  Visual testing is a technique that helps you verify that your UI appears correctly to your users. Unlike functional testing, which ensures your application works correctly, visual testing verifies that your application looks correct.
                </p>
                <p>
                  Visually helps you detect visual regressions by taking screenshots of your application and comparing them to baseline images. When visual changes are detected, Visually highlights the differences and allows you to approve or reject them.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Installation</CardTitle>
                <CardDescription>
                  Follow these steps to integrate Visually with your testing framework
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">1. Install the package</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
                    <code>npm install @visually/sdk --save-dev</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard("npm install @visually/sdk --save-dev", "Install command")}
                  >
                    {copiedCode === "npm install @visually/sdk --save-dev" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <h3 className="text-lg font-medium mb-3">2. Configure your project</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
                    <code>{`// visually.config.js
module.exports = {
  projectToken: 'your-project-token',
  apiUrl: 'https://api.visually.dev',
  browsers: ['chrome', 'firefox'],
  viewports: [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 375, height: 812, name: 'mobile' },
  ],
};`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`// visually.config.js
module.exports = {
  projectToken: 'your-project-token',
  apiUrl: 'https://api.visually.dev',
  browsers: ['chrome', 'firefox'],
  viewports: [
    { width: 1920, height: 1080, name: 'desktop' },
    { width: 375, height: 812, name: 'mobile' },
  ],
};`, "Configuration")}
                  >
                    {copiedCode?.includes("visually.config.js") ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <h3 className="text-lg font-medium mb-3">3. Add to your tests</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                    <code>{`// example.test.js
const { visualize } = require('@visually/sdk');

describe('Homepage', () => {
  it('should display correctly', async () => {
    await page.goto('https://example.com');
    await visualize('homepage');
  });
});`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`// example.test.js
const { visualize } = require('@visually/sdk');

describe('Homepage', () => {
  it('should display correctly', async () => {
    await page.goto('https://example.com');
    await visualize('homepage');
  });
});`, "Test example")}
                  >
                    {copiedCode?.includes("example.test.js") ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Concepts</CardTitle>
                <CardDescription>
                  Understand the core concepts behind Visually
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-muted p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Snapshots</h3>
                      <p className="text-muted-foreground">
                        Snapshots are screenshots of your application captured during test runs. They are compared against baseline images to detect visual changes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-muted p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <Database className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Baselines</h3>
                      <p className="text-muted-foreground">
                        Baselines are approved snapshots that serve as the reference point for future comparisons. When a visual change is detected, you can approve it to set a new baseline.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-muted p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Project Tokens</h3>
                      <p className="text-muted-foreground">
                        Project tokens are unique identifiers that associate snapshots with specific projects. They are used to authenticate API requests and organize your tests.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  Complete reference for the Visually API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Authentication</h3>
                    <p className="text-muted-foreground mb-4">
                      All API requests require authentication using your project token.
                    </p>
                    <div className="relative">
                      <pre className="bg-black p-4 rounded-md overflow-x-auto font-mono text-sm text-white">
                        <code>{`curl -X POST https://api.visually.dev/v1/snapshots \\
  -H "Authorization: Bearer your-project-token" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "homepage", "image": "base64-encoded-image"}'`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`curl -X POST https://api.visually.dev/v1/snapshots \\
  -H "Authorization: Bearer your-project-token" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "homepage", "image": "base64-encoded-image"}'`, "API example")}
                      >
                        {copiedCode?.includes("curl -X POST") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Endpoints</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">POST</Badge>
                          <code className="text-sm font-bold">/v1/snapshots</code>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          Upload a new snapshot for comparison.
                        </p>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Terminal className="h-3 w-3" />
                          <span>Try it</span>
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">GET</Badge>
                          <code className="text-sm font-bold">/v1/snapshots/{"{id}"}</code>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          Get details for a specific snapshot.
                        </p>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Terminal className="h-3 w-3" />
                          <span>Try it</span>
                        </Button>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-purple-500 text-white px-2 py-0.5 rounded text-xs">PUT</Badge>
                          <code className="text-sm font-bold">/v1/snapshots/{"{id}"}/approve</code>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          Approve a snapshot and set it as the new baseline.
                        </p>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Terminal className="h-3 w-3" />
                          <span>Try it</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SDK Reference</CardTitle>
                <CardDescription>
                  Documentation for the JavaScript SDK
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">Methods</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-1">visualize(name, options)</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      Captures a screenshot of the current page and uploads it for comparison.
                    </p>
                    <div className="relative">
                      <pre className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-xs">
                        <code>{`await visualize('homepage', {
  element: '#content',  // Optional: Capture a specific element
  ignoreRegions: [     // Optional: Ignore dynamic regions
    { x: 10, y: 10, width: 100, height: 50 }
  ],
  viewports: ['mobile'] // Optional: Override default viewports
});`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-1">configure(options)</h4>
                    <p className="text-muted-foreground text-sm mb-3">
                      Override default configuration at runtime.
                    </p>
                    <div className="relative">
                      <pre className="bg-muted p-3 rounded-md overflow-x-auto font-mono text-xs">
                        <code>{`configure({
  diffThreshold: 0.1,  // Percentage difference to trigger a failure
  screenshotDelay: 100, // Wait before capturing screenshot
  requestTimeout: 30000 // API request timeout in ms
});`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Integration Examples</CardTitle>
                <CardDescription>
                  Examples for integrating Visually with popular testing frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="jest">
                  <TabsList className="mb-4">
                    <TabsTrigger value="jest">Jest</TabsTrigger>
                    <TabsTrigger value="cypress">Cypress</TabsTrigger>
                    <TabsTrigger value="playwright">Playwright</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="jest" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                        <code>{`// jest-setup.js
const { configureVisually } = require('@visually/sdk');

beforeAll(() => {
  configureVisually({
    projectToken: process.env.VISUALLY_TOKEN,
  });
});

// test.spec.js
const { visualize } = require('@visually/sdk');

describe('Visual tests', () => {
  it('Homepage should match baseline', async () => {
    await page.goto('https://example.com');
    await page.waitForSelector('#content');
    await visualize('homepage');
  });
});`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`// jest-setup.js
const { configureVisually } = require('@visually/sdk');

beforeAll(() => {
  configureVisually({
    projectToken: process.env.VISUALLY_TOKEN,
  });
});

// test.spec.js
const { visualize } = require('@visually/sdk');

describe('Visual tests', () => {
  it('Homepage should match baseline', async () => {
    await page.goto('https://example.com');
    await page.waitForSelector('#content');
    await visualize('homepage');
  });
});`, "Jest example")}
                      >
                        {copiedCode?.includes("jest-setup.js") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cypress" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                        <code>{`// cypress/plugins/index.js
const { configureVisually } = require('@visually/sdk/cypress');

module.exports = (on, config) => {
  configureVisually(on, config, {
    projectToken: process.env.VISUALLY_TOKEN,
  });
  return config;
};

// cypress/integration/visual.spec.js
describe('Visual testing', () => {
  it('captures homepage', () => {
    cy.visit('/');
    cy.get('#content').should('be.visible');
    cy.visualize('homepage');
  });
});`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`// cypress/plugins/index.js
const { configureVisually } = require('@visually/sdk/cypress');

module.exports = (on, config) => {
  configureVisually(on, config, {
    projectToken: process.env.VISUALLY_TOKEN,
  });
  return config;
};

// cypress/integration/visual.spec.js
describe('Visual testing', () => {
  it('captures homepage', () => {
    cy.visit('/');
    cy.get('#content').should('be.visible');
    cy.visualize('homepage');
  });
});`, "Cypress example")}
                      >
                        {copiedCode?.includes("cypress/plugins/index.js") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="playwright" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                        <code>{`// playwright.config.js
const { configureVisually } = require('@visually/sdk/playwright');

module.exports = {
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
      },
    },
  ],
  globalSetup: async () => {
    await configureVisually({
      projectToken: process.env.VISUALLY_TOKEN,
    });
  },
};

// tests/visual.spec.js
const { test } = require('@playwright/test');
const { visualize } = require('@visually/sdk/playwright');

test('homepage visual test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.waitForSelector('#content');
  await visualize(page, 'homepage');
});`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`// playwright.config.js
const { configureVisually } = require('@visually/sdk/playwright');

module.exports = {
  projects: [
    {
      name: 'Chrome',
      use: {
        browserName: 'chromium',
      },
    },
  ],
  globalSetup: async () => {
    await configureVisually({
      projectToken: process.env.VISUALLY_TOKEN,
    });
  },
};

// tests/visual.spec.js
const { test } = require('@playwright/test');
const { visualize } = require('@visually/sdk/playwright');

test('homepage visual test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.waitForSelector('#content');
  await visualize(page, 'homepage');
});`, "Playwright example")}
                      >
                        {copiedCode?.includes("playwright.config.js") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CI/CD Integration</CardTitle>
                <CardDescription>
                  Automate visual testing in your CI/CD pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="github">
                  <TabsList className="mb-4">
                    <TabsTrigger value="github">GitHub Actions</TabsTrigger>
                    <TabsTrigger value="circle">CircleCI</TabsTrigger>
                    <TabsTrigger value="jenkins">Jenkins</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="github" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                        <code>{`# .github/workflows/visual-tests.yml
name: Visual Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm ci
      - name: Run visual tests
        run: npm run test:visual
        env:
          VISUALLY_TOKEN: \${{ secrets.VISUALLY_TOKEN }}`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`# .github/workflows/visual-tests.yml
name: Visual Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install dependencies
        run: npm ci
      - name: Run visual tests
        run: npm run test:visual
        env:
          VISUALLY_TOKEN: \${{ secrets.VISUALLY_TOKEN }}`, "GitHub Actions example")}
                      >
                        {copiedCode?.includes("visual-tests.yml") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="circle" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                        <code>{`# .circleci/config.yml
version: 2.1
jobs:
  visual-tests:
    docker:
      - image: cimg/node:16.14
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: npm ci
      - run:
          name: Run visual tests
          command: npm run test:visual
          environment:
            VISUALLY_TOKEN: \${VISUALLY_TOKEN}

workflows:
  version: 2
  build-and-test:
    jobs:
      - visual-tests`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`# .circleci/config.yml
version: 2.1
jobs:
  visual-tests:
    docker:
      - image: cimg/node:16.14
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: npm ci
      - run:
          name: Run visual tests
          command: npm run test:visual
          environment:
            VISUALLY_TOKEN: \${VISUALLY_TOKEN}

workflows:
  version: 2
  build-and-test:
    jobs:
      - visual-tests`, "CircleCI example")}
                      >
                        {copiedCode?.includes("config.yml") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="jenkins" className="space-y-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                        <code>{`// Jenkinsfile
pipeline {
    agent {
        docker {
            image 'node:16-alpine'
        }
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Visual Tests') {
            steps {
                withCredentials([string(credentialsId: 'visually-token', variable: 'VISUALLY_TOKEN')]) {
                    sh 'npm run test:visual'
                }
            }
        }
    }
}`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`// Jenkinsfile
pipeline {
    agent {
        docker {
            image 'node:16-alpine'
        }
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Visual Tests') {
            steps {
                withCredentials([string(credentialsId: 'visually-token', variable: 'VISUALLY_TOKEN')]) {
                    sh 'npm run test:visual'
                }
            }
        }
    }
}`, "Jenkins example")}
                      >
                        {copiedCode?.includes("Jenkinsfile") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DocumentationPage;
