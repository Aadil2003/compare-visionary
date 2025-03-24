
import { PageLayout } from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Terminal, Code, Server, Database, Lock, ImageIcon, Undo, Eye } from "lucide-react";
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
              <TabsTrigger value="resemble">Resemble.js</TabsTrigger>
              <TabsTrigger value="examples">Code Examples</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
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
                <h3 className="text-lg font-medium mb-3">1. Install the required packages</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
                    <code>npm install resemblejs --save-dev</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard("npm install resemblejs --save-dev", "Install command")}
                  >
                    {copiedCode === "npm install resemblejs --save-dev" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <h3 className="text-lg font-medium mb-3">2. Create an image comparison utility</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
                    <code>{`// imageComparison.js
import resemble from 'resemblejs';

export const compareImages = async (image1Url, image2Url) => {
  // Load images as base64
  const image1Data = await loadImageAsBase64(image1Url);
  const image2Data = await loadImageAsBase64(image2Url);
  
  // Compare using resemble.js
  return new Promise((resolve) => {
    resemble(image1Data)
      .compareTo(image2Data)
      .ignoreColors()
      .onComplete((data) => {
        resolve({
          diffPercentage: Number(data.misMatchPercentage),
          diffImageUrl: data.getImageDataUrl()
        });
      });
  });
};

const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error(\`Failed to load image: \${url}\`));
    img.src = url;
  });
};`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`// imageComparison.js
import resemble from 'resemblejs';

export const compareImages = async (image1Url, image2Url) => {
  // Load images as base64
  const image1Data = await loadImageAsBase64(image1Url);
  const image2Data = await loadImageAsBase64(image2Url);
  
  // Compare using resemble.js
  return new Promise((resolve) => {
    resemble(image1Data)
      .compareTo(image2Data)
      .ignoreColors()
      .onComplete((data) => {
        resolve({
          diffPercentage: Number(data.misMatchPercentage),
          diffImageUrl: data.getImageDataUrl()
        });
      });
  });
};

const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error(\`Failed to load image: \${url}\`));
    img.src = url;
  });
};`, "Image Comparison Utility")}
                  >
                    {copiedCode?.includes("imageComparison.js") ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <h3 className="text-lg font-medium mb-3">3. Add to your tests</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                    <code>{`// visualTest.js
import { compareImages } from './imageComparison';

async function visualTest(baselineImagePath, currentImagePath, testName) {
  try {
    const { diffPercentage, diffImageUrl } = await compareImages(
      baselineImagePath,
      currentImagePath
    );
    
    console.log(\`Test: \${testName}, Difference: \${diffPercentage}%\`);
    
    // You can save the diff image or make assertions based on the difference
    if (diffPercentage > 5) {
      console.error(\`Visual regression detected in \${testName}\`);
      // Save diff image or fail the test
    }
    
    return { diffPercentage, diffImageUrl };
  } catch (error) {
    console.error('Error in visual test:', error);
    throw error;
  }
}`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`// visualTest.js
import { compareImages } from './imageComparison';

async function visualTest(baselineImagePath, currentImagePath, testName) {
  try {
    const { diffPercentage, diffImageUrl } = await compareImages(
      baselineImagePath,
      currentImagePath
    );
    
    console.log(\`Test: \${testName}, Difference: \${diffPercentage}%\`);
    
    // You can save the diff image or make assertions based on the difference
    if (diffPercentage > 5) {
      console.error(\`Visual regression detected in \${testName}\`);
      // Save diff image or fail the test
    }
    
    return { diffPercentage, diffImageUrl };
  } catch (error) {
    console.error('Error in visual test:', error);
    throw error;
  }
}`, "Visual Test example")}
                  >
                    {copiedCode?.includes("visualTest.js") ? (
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
                      <Eye className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Difference Analysis</h3>
                      <p className="text-muted-foreground">
                        Visually uses resemble.js to perform pixel-by-pixel comparisons between images, calculating a percentage difference and generating visual diffs that highlight changes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resemble" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Resemble.js Integration</CardTitle>
                <CardDescription>
                  How to effectively use resemble.js for visual regression testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">Basic Setup</h3>
                <p className="text-muted-foreground mb-4">
                  Resemble.js is a lightweight JavaScript library that analyzes and compares images with html5 canvas and pixel comparison. Here's how to set it up:
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
                    <code>{`// Basic resemble.js implementation
import resemble from 'resemblejs';

// Simple comparison
resemble(image1)
  .compareTo(image2)
  .onComplete(function(data) {
    console.log(data);
    /*
    {
      misMatchPercentage : 100, // %
      isSameDimensions: true, // or false
      dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
      getImageDataUrl: function(){}
    }
    */
  });`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`// Basic resemble.js implementation
import resemble from 'resemblejs';

// Simple comparison
resemble(image1)
  .compareTo(image2)
  .onComplete(function(data) {
    console.log(data);
    /*
    {
      misMatchPercentage : 100, // %
      isSameDimensions: true, // or false
      dimensionDifference: { width: 0, height: -1 }, // defined if dimensions are not the same
      getImageDataUrl: function(){}
    }
    */
  });`, "Basic Resemble.js")}
                  >
                    {copiedCode?.includes("Basic resemble.js implementation") ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <h3 className="text-lg font-medium mb-3">Advanced Configuration</h3>
                <p className="text-muted-foreground mb-4">
                  Resemble.js offers powerful configuration options to fine-tune your image comparisons:
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm mb-4">
                    <code>{`// Advanced configuration
resemble(image1)
  .compareTo(image2)
  .ignoreColors()            // Compare structure only, ignore colors
  .ignoreAntialiasing()      // Ignore anti-aliasing pixels
  .ignoreAlpha()             // Ignore alpha channel
  .scaleToSameSize()         // Scale images to same size before comparison
  .outputSettings({
    errorType: 'movement',   // 'flat', 'movement', 'flatDifferenceIntensity', 'movementDifferenceIntensity', 'diffOnly'
    errorColor: {            // Custom highlight color for differences
      red: 255,
      green: 0,
      blue: 255
    },
    transparency: 0.7,       // Transparency of unchanged pixels
    largeImageThreshold: 1200 // Compare only parts of images > 1200px
  })
  .onComplete(function(data) {
    console.log(data.misMatchPercentage);
  });`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`// Advanced configuration
resemble(image1)
  .compareTo(image2)
  .ignoreColors()            // Compare structure only, ignore colors
  .ignoreAntialiasing()      // Ignore anti-aliasing pixels
  .ignoreAlpha()             // Ignore alpha channel
  .scaleToSameSize()         // Scale images to same size before comparison
  .outputSettings({
    errorType: 'movement',   // 'flat', 'movement', 'flatDifferenceIntensity', 'movementDifferenceIntensity', 'diffOnly'
    errorColor: {            // Custom highlight color for differences
      red: 255,
      green: 0,
      blue: 255
    },
    transparency: 0.7,       // Transparency of unchanged pixels
    largeImageThreshold: 1200 // Compare only parts of images > 1200px
  })
  .onComplete(function(data) {
    console.log(data.misMatchPercentage);
  });`, "Advanced Resemble.js")}
                  >
                    {copiedCode?.includes("Advanced configuration") ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <h3 className="text-lg font-medium mb-3">Ignoring Regions</h3>
                <p className="text-muted-foreground mb-4">
                  One common requirement is to ignore specific regions of an image (e.g., timestamps, dynamic content):
                </p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm">
                    <code>{`// Ignoring specific regions
const compareWithIgnoredRegions = async (image1Url, image2Url, ignoredRegions) => {
  const img1 = await loadImage(image1Url);
  const img2 = await loadImage(image2Url);
  
  // Create canvases for both images
  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');
  canvas1.width = img1.width;
  canvas1.height = img1.height;
  canvas2.width = img2.width;
  canvas2.height = img2.height;
  
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  
  // Draw images on canvases
  ctx1.drawImage(img1, 0, 0);
  ctx2.drawImage(img2, 0, 0);
  
  // Mask out ignore regions with white rectangles
  ignoredRegions.forEach(region => {
    ctx1.fillStyle = 'white';
    ctx1.fillRect(region.x, region.y, region.width, region.height);
    
    ctx2.fillStyle = 'white';
    ctx2.fillRect(region.x, region.y, region.width, region.height);
  });
  
  // Get data URLs from canvases and compare
  const img1DataUrl = canvas1.toDataURL('image/png');
  const img2DataUrl = canvas2.toDataURL('image/png');
  
  return new Promise((resolve) => {
    resemble(img1DataUrl)
      .compareTo(img2DataUrl)
      .onComplete((data) => {
        resolve({
          diffPercentage: Number(data.misMatchPercentage),
          diffImageUrl: data.getImageDataUrl()
        });
      });
  });
};`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(`// Ignoring specific regions
const compareWithIgnoredRegions = async (image1Url, image2Url, ignoredRegions) => {
  const img1 = await loadImage(image1Url);
  const img2 = await loadImage(image2Url);
  
  // Create canvases for both images
  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');
  canvas1.width = img1.width;
  canvas1.height = img1.height;
  canvas2.width = img2.width;
  canvas2.height = img2.height;
  
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  
  // Draw images on canvases
  ctx1.drawImage(img1, 0, 0);
  ctx2.drawImage(img2, 0, 0);
  
  // Mask out ignore regions with white rectangles
  ignoredRegions.forEach(region => {
    ctx1.fillStyle = 'white';
    ctx1.fillRect(region.x, region.y, region.width, region.height);
    
    ctx2.fillStyle = 'white';
    ctx2.fillRect(region.x, region.y, region.width, region.height);
  });
  
  // Get data URLs from canvases and compare
  const img1DataUrl = canvas1.toDataURL('image/png');
  const img2DataUrl = canvas2.toDataURL('image/png');
  
  return new Promise((resolve) => {
    resemble(img1DataUrl)
      .compareTo(img2DataUrl)
      .onComplete((data) => {
        resolve({
          diffPercentage: Number(data.misMatchPercentage),
          diffImageUrl: data.getImageDataUrl()
        });
      });
  });
};`, "Ignoring Regions")}
                  >
                    {copiedCode?.includes("Ignoring specific regions") ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
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
                        <code>{`// jest-visual.test.js
import puppeteer from 'puppeteer';
import { compareImages } from './utils/imageComparison';
import fs from 'fs/promises';
import path from 'path';

describe('Visual regression tests', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  it('should match homepage visual baseline', async () => {
    // Navigate to the page
    await page.goto('https://example.com');
    await page.waitForSelector('#content');
    
    // Take a screenshot
    const screenshotPath = path.join(__dirname, 'screenshots', 'homepage-current.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    // Get baseline screenshot path
    const baselinePath = path.join(__dirname, 'baselines', 'homepage.png');
    
    // Check if baseline exists
    try {
      await fs.access(baselinePath);
    } catch (error) {
      // If baseline doesn't exist, create it
      await fs.mkdir(path.dirname(baselinePath), { recursive: true });
      await fs.copyFile(screenshotPath, baselinePath);
      console.log('Baseline created at:', baselinePath);
      return;
    }
    
    // Compare images
    const result = await compareImages(baselinePath, screenshotPath);
    
    // Save diff if there's a difference
    if (result.diffPercentage > 0) {
      const diffPath = path.join(__dirname, 'diffs', 'homepage-diff.png');
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      
      // Convert base64 diff image to file
      const diffImageData = result.diffImageUrl.replace(/^data:image\\/png;base64,/, '');
      await fs.writeFile(diffPath, Buffer.from(diffImageData, 'base64'));
    }
    
    // Assert the difference is below threshold
    expect(result.diffPercentage).toBeLessThanOrEqual(5);
  });
});`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`// jest-visual.test.js
import puppeteer from 'puppeteer';
import { compareImages } from './utils/imageComparison';
import fs from 'fs/promises';
import path from 'path';

describe('Visual regression tests', () => {
  let browser;
  let page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  it('should match homepage visual baseline', async () => {
    // Navigate to the page
    await page.goto('https://example.com');
    await page.waitForSelector('#content');
    
    // Take a screenshot
    const screenshotPath = path.join(__dirname, 'screenshots', 'homepage-current.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    
    // Get baseline screenshot path
    const baselinePath = path.join(__dirname, 'baselines', 'homepage.png');
    
    // Check if baseline exists
    try {
      await fs.access(baselinePath);
    } catch (error) {
      // If baseline doesn't exist, create it
      await fs.mkdir(path.dirname(baselinePath), { recursive: true });
      await fs.copyFile(screenshotPath, baselinePath);
      console.log('Baseline created at:', baselinePath);
      return;
    }
    
    // Compare images
    const result = await compareImages(baselinePath, screenshotPath);
    
    // Save diff if there's a difference
    if (result.diffPercentage > 0) {
      const diffPath = path.join(__dirname, 'diffs', 'homepage-diff.png');
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      
      // Convert base64 diff image to file
      const diffImageData = result.diffImageUrl.replace(/^data:image\\/png;base64,/, '');
      await fs.writeFile(diffPath, Buffer.from(diffImageData, 'base64'));
    }
    
    // Assert the difference is below threshold
    expect(result.diffPercentage).toBeLessThanOrEqual(5);
  });
});`, "Jest example")}
                      >
                        {copiedCode?.includes("jest-visual.test.js") ? (
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
const fs = require('fs');
const path = require('path');
const { compareImages } = require('../../utils/imageComparison');

module.exports = (on, config) => {
  on('task', {
    compareScreenshots({ baselinePath, currentPath }) {
      // Ensure paths are absolute
      const resolvedBaseline = path.resolve(baselinePath);
      const resolvedCurrent = path.resolve(currentPath);
      
      // Read image files as Base64
      const baselineImage = fs.readFileSync(resolvedBaseline, { encoding: 'base64' });
      const currentImage = fs.readFileSync(resolvedCurrent, { encoding: 'base64' });
      
      // Convert to data URLs for resemble.js
      const baselineDataUrl = \`data:image/png;base64,\${baselineImage}\`;
      const currentDataUrl = \`data:image/png;base64,\${currentImage}\`;
      
      // Compare and return result
      return compareImages(baselineDataUrl, currentDataUrl);
    }
  });
  
  return config;
};

// cypress/support/commands.js
Cypress.Commands.add('compareVisual', (name, threshold = 5) => {
  const screenshotsFolder = Cypress.config('screenshotsFolder');
  const baselineFolder = path.join(process.cwd(), 'cypress/baselines');
  
  // Create baseline folder if it doesn't exist
  if (!fs.existsSync(baselineFolder)) {
    fs.mkdirSync(baselineFolder, { recursive: true });
  }
  
  // Take a screenshot
  cy.screenshot(name, { capture: 'viewport' });
  
  const currentPath = path.join(screenshotsFolder, \`\${name}.png\`);
  const baselinePath = path.join(baselineFolder, \`\${name}.png\`);
  
  // If baseline doesn't exist, create it
  if (!fs.existsSync(baselinePath)) {
    cy.task('log', \`Creating baseline for \${name}\`);
    fs.copyFileSync(currentPath, baselinePath);
    return;
  }
  
  // Compare images
  cy.task('compareScreenshots', { baselinePath, currentPath }).then(result => {
    // Save diff if there's a difference
    if (result.diffPercentage > 0) {
      const diffFolder = path.join(process.cwd(), 'cypress/diffs');
      if (!fs.existsSync(diffFolder)) {
        fs.mkdirSync(diffFolder, { recursive: true });
      }
      
      const diffPath = path.join(diffFolder, \`\${name}-diff.png\`);
      const diffImageData = result.diffImageUrl.replace(/^data:image\\/png;base64,/, '');
      fs.writeFileSync(diffPath, Buffer.from(diffImageData, 'base64'));
    }
    
    // Assert the difference is below threshold
    expect(result.diffPercentage).to.be.at.most(threshold);
  });
});

// cypress/integration/visual.spec.js
describe('Visual tests', () => {
  it('should match homepage visual baseline', () => {
    cy.visit('/');
    cy.get('#content').should('be.visible');
    cy.compareVisual('homepage');
  });
});`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`// cypress/plugins/index.js
const fs = require('fs');
const path = require('path');
const { compareImages } = require('../../utils/imageComparison');

module.exports = (on, config) => {
  on('task', {
    compareScreenshots({ baselinePath, currentPath }) {
      // Ensure paths are absolute
      const resolvedBaseline = path.resolve(baselinePath);
      const resolvedCurrent = path.resolve(currentPath);
      
      // Read image files as Base64
      const baselineImage = fs.readFileSync(resolvedBaseline, { encoding: 'base64' });
      const currentImage = fs.readFileSync(resolvedCurrent, { encoding: 'base64' });
      
      // Convert to data URLs for resemble.js
      const baselineDataUrl = \`data:image/png;base64,\${baselineImage}\`;
      const currentDataUrl = \`data:image/png;base64,\${currentImage}\`;
      
      // Compare and return result
      return compareImages(baselineDataUrl, currentDataUrl);
    }
  });
  
  return config;
};

// cypress/support/commands.js
Cypress.Commands.add('compareVisual', (name, threshold = 5) => {
  const screenshotsFolder = Cypress.config('screenshotsFolder');
  const baselineFolder = path.join(process.cwd(), 'cypress/baselines');
  
  // Create baseline folder if it doesn't exist
  if (!fs.existsSync(baselineFolder)) {
    fs.mkdirSync(baselineFolder, { recursive: true });
  }
  
  // Take a screenshot
  cy.screenshot(name, { capture: 'viewport' });
  
  const currentPath = path.join(screenshotsFolder, \`\${name}.png\`);
  const baselinePath = path.join(baselineFolder, \`\${name}.png\`);
  
  // If baseline doesn't exist, create it
  if (!fs.existsSync(baselinePath)) {
    cy.task('log', \`Creating baseline for \${name}\`);
    fs.copyFileSync(currentPath, baselinePath);
    return;
  }
  
  // Compare images
  cy.task('compareScreenshots', { baselinePath, currentPath }).then(result => {
    // Save diff if there's a difference
    if (result.diffPercentage > 0) {
      const diffFolder = path.join(process.cwd(), 'cypress/diffs');
      if (!fs.existsSync(diffFolder)) {
        fs.mkdirSync(diffFolder, { recursive: true });
      }
      
      const diffPath = path.join(diffFolder, \`\${name}-diff.png\`);
      const diffImageData = result.diffImageUrl.replace(/^data:image\\/png;base64,/, '');
      fs.writeFileSync(diffPath, Buffer.from(diffImageData, 'base64'));
    }
    
    // Assert the difference is below threshold
    expect(result.diffPercentage).to.be.at.most(threshold);
  });
});

// cypress/integration/visual.spec.js
describe('Visual tests', () => {
  it('should match homepage visual baseline', () => {
    cy.visit('/');
    cy.get('#content').should('be.visible');
    cy.compareVisual('homepage');
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
                        <code>{`// utils/visualTest.js
const fs = require('fs/promises');
const path = require('path');
const { compareImages } = require('./imageComparison');

async function visualTest({ page, name, threshold = 5, selector }) {
  const testInfo = {
    name,
    timestamp: new Date().toISOString(),
  };
  
  // Create directories
  const basePath = path.join(process.cwd(), 'visual-tests');
  const baselinePath = path.join(basePath, 'baselines', \`\${name}.png\`);
  const screenshotPath = path.join(basePath, 'screenshots', \`\${name}-\${testInfo.timestamp}.png\`);
  const diffPath = path.join(basePath, 'diffs', \`\${name}-\${testInfo.timestamp}.png\`);
  
  await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
  
  // Take screenshot
  if (selector) {
    const element = await page.$(selector);
    if (!element) {
      throw new Error(\`Element not found: \${selector}\`);
    }
    await element.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }
  
  // Check if baseline exists
  try {
    await fs.access(baselinePath);
  } catch (error) {
    // Create baseline if it doesn't exist
    await fs.mkdir(path.dirname(baselinePath), { recursive: true });
    await fs.copyFile(screenshotPath, baselinePath);
    console.log(\`Created baseline: \${baselinePath}\`);
    return {
      status: 'created',
      baselinePath,
      screenshotPath,
    };
  }
  
  // Compare images
  try {
    const result = await compareImages(baselinePath, screenshotPath);
    
    // Save diff image if there's a difference
    if (result.diffPercentage > 0) {
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      const diffImageData = result.diffImageUrl.replace(/^data:image\\/png;base64,/, '');
      await fs.writeFile(diffPath, Buffer.from(diffImageData, 'base64'));
    }
    
    // Determine test status
    const status = result.diffPercentage <= threshold ? 'passed' : 'failed';
    
    return {
      status,
      diffPercentage: result.diffPercentage,
      threshold,
      baselinePath,
      screenshotPath,
      diffPath: result.diffPercentage > 0 ? diffPath : null,
    };
  } catch (error) {
    console.error('Error comparing images:', error);
    throw error;
  }
}

module.exports = { visualTest };

// tests/visual.spec.js
const { test, expect } = require('@playwright/test');
const { visualTest } = require('../utils/visualTest');

test('Homepage visual test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.waitForSelector('#content');
  
  const result = await visualTest({
    page,
    name: 'homepage',
    threshold: 5,
  });
  
  if (result.status === 'failed') {
    console.log(\`Visual test failed: \${result.diffPercentage}% difference (threshold: \${result.threshold}%)\`);
    console.log(\`Diff image saved at: \${result.diffPath}\`);
  }
  
  expect(result.status).toBe('passed');
});

// Testing a specific element
test('Header visual test', async ({ page }) => {
  await page.goto('https://example.com');
  
  const result = await visualTest({
    page,
    name: 'header',
    selector: 'header',
    threshold: 2, // Stricter threshold for header
  });
  
  expect(result.status).toBe('passed');
});`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`// utils/visualTest.js
const fs = require('fs/promises');
const path = require('path');
const { compareImages } = require('./imageComparison');

async function visualTest({ page, name, threshold = 5, selector }) {
  const testInfo = {
    name,
    timestamp: new Date().toISOString(),
  };
  
  // Create directories
  const basePath = path.join(process.cwd(), 'visual-tests');
  const baselinePath = path.join(basePath, 'baselines', \`\${name}.png\`);
  const screenshotPath = path.join(basePath, 'screenshots', \`\${name}-\${testInfo.timestamp}.png\`);
  const diffPath = path.join(basePath, 'diffs', \`\${name}-\${testInfo.timestamp}.png\`);
  
  await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
  
  // Take screenshot
  if (selector) {
    const element = await page.$(selector);
    if (!element) {
      throw new Error(\`Element not found: \${selector}\`);
    }
    await element.screenshot({ path: screenshotPath });
  } else {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }
  
  // Check if baseline exists
  try {
    await fs.access(baselinePath);
  } catch (error) {
    // Create baseline if it doesn't exist
    await fs.mkdir(path.dirname(baselinePath), { recursive: true });
    await fs.copyFile(screenshotPath, baselinePath);
    console.log(\`Created baseline: \${baselinePath}\`);
    return {
      status: 'created',
      baselinePath,
      screenshotPath,
    };
  }
  
  // Compare images
  try {
    const result = await compareImages(baselinePath, screenshotPath);
    
    // Save diff image if there's a difference
    if (result.diffPercentage > 0) {
      await fs.mkdir(path.dirname(diffPath), { recursive: true });
      const diffImageData = result.diffImageUrl.replace(/^data:image\\/png;base64,/, '');
      await fs.writeFile(diffPath, Buffer.from(diffImageData, 'base64'));
    }
    
    // Determine test status
    const status = result.diffPercentage <= threshold ? 'passed' : 'failed';
    
    return {
      status,
      diffPercentage: result.diffPercentage,
      threshold,
      baselinePath,
      screenshotPath,
      diffPath: result.diffPercentage > 0 ? diffPath : null,
    };
  } catch (error) {
    console.error('Error comparing images:', error);
    throw error;
  }
}

module.exports = { visualTest };

// tests/visual.spec.js
const { test, expect } = require('@playwright/test');
const { visualTest } = require('../utils/visualTest');

test('Homepage visual test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.waitForSelector('#content');
  
  const result = await visualTest({
    page,
    name: 'homepage',
    threshold: 5,
  });
  
  if (result.status === 'failed') {
    console.log(\`Visual test failed: \${result.diffPercentage}% difference (threshold: \${result.threshold}%)\`);
    console.log(\`Diff image saved at: \${result.diffPath}\`);
  }
  
  expect(result.status).toBe('passed');
});

// Testing a specific element
test('Header visual test', async ({ page }) => {
  await page.goto('https://example.com');
  
  const result = await visualTest({
    page,
    name: 'header',
    selector: 'header',
    threshold: 2, // Stricter threshold for header
  });
  
  expect(result.status).toBe('passed');
});`, "Playwright example")}
                      >
                        {copiedCode?.includes("utils/visualTest.js") ? (
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
name: Visual Regression Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  visual-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Download baseline images
        # Only for PRs - main branch should be source of truth
        if: github.event_name == 'pull_request'
        run: |
          # Download baselines from artifact storage or main branch
          mkdir -p visual-tests/baselines
          # Example using GitHub API to download from main branch
          git fetch origin main
          git checkout origin/main -- visual-tests/baselines
          git checkout -
      
      - name: Run visual tests
        run: npm run test:visual
          
      - name: Upload screenshots, baselines and diffs
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: visual-test-results
          path: |
            visual-tests/screenshots
            visual-tests/baselines
            visual-tests/diffs
          
      - name: Update baselines
        # Only if tests pass and it's a merge to main
        if: success() && github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: |
          # Generate a unique tag for the new baselines
          BASELINE_TAG="baselines-\$(date +%Y%m%d-%H%M%S)"
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          
          # Commit updated baselines back to the repository
          git add visual-tests/baselines
          git commit -m "Update visual test baselines [skip ci]"
          git tag $BASELINE_TAG
          git push origin main
          git push origin $BASELINE_TAG`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`# .github/workflows/visual-tests.yml
name: Visual Regression Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  visual-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Download baseline images
        # Only for PRs - main branch should be source of truth
        if: github.event_name == 'pull_request'
        run: |
          # Download baselines from artifact storage or main branch
          mkdir -p visual-tests/baselines
          # Example using GitHub API to download from main branch
          git fetch origin main
          git checkout origin/main -- visual-tests/baselines
          git checkout -
      
      - name: Run visual tests
        run: npm run test:visual
          
      - name: Upload screenshots, baselines and diffs
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: visual-test-results
          path: |
            visual-tests/screenshots
            visual-tests/baselines
            visual-tests/diffs
          
      - name: Update baselines
        # Only if tests pass and it's a merge to main
        if: success() && github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: |
          # Generate a unique tag for the new baselines
          BASELINE_TAG="baselines-\$(date +%Y%m%d-%H%M%S)"
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          
          # Commit updated baselines back to the repository
          git add visual-tests/baselines
          git commit -m "Update visual test baselines [skip ci]"
          git tag $BASELINE_TAG
          git push origin main
          git push origin $BASELINE_TAG`, "GitHub Actions example")}
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

orbs:
  node: circleci/node@5.0.2
  browser-tools: circleci/browser-tools@1.3.0

jobs:
  visual-tests:
    docker:
      - image: cimg/node:16.14-browsers
    
    steps:
      - checkout
      
      - browser-tools/install-browser-tools:
          chrome-version: stable
      
      - node/install-packages:
          pkg-manager: npm
          
      - run:
          name: Restore baseline images from workspace
          command: |
            mkdir -p visual-tests/baselines
            if [ -d /tmp/workspace/baselines ]; then
              cp -r /tmp/workspace/baselines/* visual-tests/baselines/
            fi
      
      - run:
          name: Run visual tests
          command: npm run test:visual
          
      - run:
          name: Organize test results
          command: |
            mkdir -p visual-test-results
            cp -r visual-tests/screenshots visual-test-results/
            cp -r visual-tests/diffs visual-test-results/ || true
            cp -r visual-tests/baselines visual-test-results/
      
      - store_artifacts:
          path: visual-test-results
          destination: visual-tests
          
      - persist_to_workspace:
          root: visual-tests
          paths:
            - baselines

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

orbs:
  node: circleci/node@5.0.2
  browser-tools: circleci/browser-tools@1.3.0

jobs:
  visual-tests:
    docker:
      - image: cimg/node:16.14-browsers
    
    steps:
      - checkout
      
      - browser-tools/install-browser-tools:
          chrome-version: stable
      
      - node/install-packages:
          pkg-manager: npm
          
      - run:
          name: Restore baseline images from workspace
          command: |
            mkdir -p visual-tests/baselines
            if [ -d /tmp/workspace/baselines ]; then
              cp -r /tmp/workspace/baselines/* visual-tests/baselines/
            fi
      
      - run:
          name: Run visual tests
          command: npm run test:visual
          
      - run:
          name: Organize test results
          command: |
            mkdir -p visual-test-results
            cp -r visual-tests/screenshots visual-test-results/
            cp -r visual-tests/diffs visual-test-results/ || true
            cp -r visual-tests/baselines visual-test-results/
      
      - store_artifacts:
          path: visual-test-results
          destination: visual-tests
          
      - persist_to_workspace:
          root: visual-tests
          paths:
            - baselines

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
            image 'mcr.microsoft.com/playwright:v1.27.0-focal'
        }
    }
    
    environment {
        HOME = '.'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Download Baselines') {
            steps {
                script {
                    // Create baseline directory
                    sh 'mkdir -p visual-tests/baselines'
                    
                    // If this is a PR build, download baselines from main
                    if (env.CHANGE_ID) {
                        try {
                            // Download baseline artifacts from last successful main build
                            copyArtifacts(
                                projectName: env.JOB_NAME,
                                selector: lastSuccessfulBuild(branch: 'main'),
                                filter: 'visual-tests/baselines/**',
                                fingerprintArtifacts: true,
                                optional: true
                            )
                        } catch (Exception e) {
                            echo "Warning: Could not download baselines from main. ${e.message}"
                        }
                    }
                }
            }
        }
        
        stage('Run Visual Tests') {
            steps {
                sh 'npm run test:visual'
            }
        }
    }
    
    post {
        always {
            // Archive visual test results
            archiveArtifacts artifacts: 'visual-tests/**', fingerprint: true, allowEmptyArchive: true
            
            // Create HTML report
            publishHTML(
                target: [
                    reportName: 'Visual Test Results',
                    reportDir: 'visual-tests',
                    reportFiles: 'report.html',
                    allowMissing: true,
                    keepAll: true
                ]
            )
        }
        
        success {
            // If on main branch, consider these images as the new baseline
            script {
                if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                    echo "Test passed on main branch. These images now become the new baseline."
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
            image 'mcr.microsoft.com/playwright:v1.27.0-focal'
        }
    }
    
    environment {
        HOME = '.'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Download Baselines') {
            steps {
                script {
                    // Create baseline directory
                    sh 'mkdir -p visual-tests/baselines'
                    
                    // If this is a PR build, download baselines from main
                    if (env.CHANGE_ID) {
                        try {
                            // Download baseline artifacts from last successful main build
                            copyArtifacts(
                                projectName: env.JOB_NAME,
                                selector: lastSuccessfulBuild(branch: 'main'),
                                filter: 'visual-tests/baselines/**',
                                fingerprintArtifacts: true,
                                optional: true
                            )
                        } catch (Exception e) {
                            echo "Warning: Could not download baselines from main. ${e.message}"
                        }
                    }
                }
            }
        }
        
        stage('Run Visual Tests') {
            steps {
                sh 'npm run test:visual'
            }
        }
    }
    
    post {
        always {
            // Archive visual test results
            archiveArtifacts artifacts: 'visual-tests/**', fingerprint: true, allowEmptyArchive: true
            
            // Create HTML report
            publishHTML(
                target: [
                    reportName: 'Visual Test Results',
                    reportDir: 'visual-tests',
                    reportFiles: 'report.html',
                    allowMissing: true,
                    keepAll: true
                ]
            )
        }
        
        success {
            // If on main branch, consider these images as the new baseline
            script {
                if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master') {
                    echo "Test passed on main branch. These images now become the new baseline."
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

          <TabsContent value="technology" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Visual Comparison Technology</CardTitle>
                <CardDescription>
                  Learn about the technologies powering Visually
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Resemble.js Image Comparison</h3>
                  <p className="text-muted-foreground mb-4">
                    Visually uses the open-source library resemble.js for high-performance pixel-by-pixel image comparison.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">Key Features</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Pixel-by-pixel comparison with configurable tolerance levels</li>
                      <li>Support for multiple comparison methods (RGB, HSLA, etc.)</li>
                      <li>Ability to ignore colors and focus on structure</li>
                      <li>Generation of visual diff images highlighting changes</li>
                      <li>Performance optimized for large image sets</li>
                      <li>Support for anti-aliasing detection and handling</li>
                      <li>Customizable error rendering and highlighting</li>
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Code Example</h4>
                    <div className="relative">
                      <pre className="bg-black p-4 rounded-md overflow-x-auto font-mono text-sm text-white">
                        <code>{`// Using resemble.js for advanced image comparison
import resemble from 'resemblejs';

// Basic comparison
resemble(image1)
  .compareTo(image2)
  .ignoreColors()
  .onComplete(data => {
    console.log('Difference: ' + data.misMatchPercentage + '%');
    // Get the diff image
    const diffImage = data.getImageDataUrl();
  });

// Advanced comparison with output settings
resemble(image1)
  .compareTo(image2)
  .ignoreAntialiasing()
  .scaleToSameSize()
  .outputSettings({
    errorType: 'movement',
    transparency: 0.8,
    largeImageThreshold: 1200,
    errorColor: {
      red: 255,
      green: 0,
      blue: 255
    },
  })
  .onComplete(data => {
    const diffImageUrl = data.getImageDataUrl();
    const diffPercentage = data.misMatchPercentage;
    const diffTime = data.analysisTime;
  });`}</code>
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(`// Using resemble.js for advanced image comparison
import resemble from 'resemblejs';

// Basic comparison
resemble(image1)
  .compareTo(image2)
  .ignoreColors()
  .onComplete(data => {
    console.log('Difference: ' + data.misMatchPercentage + '%');
    // Get the diff image
    const diffImage = data.getImageDataUrl();
  });

// Advanced comparison with output settings
resemble(image1)
  .compareTo(image2)
  .ignoreAntialiasing()
  .scaleToSameSize()
  .outputSettings({
    errorType: 'movement',
    transparency: 0.8,
    largeImageThreshold: 1200,
    errorColor: {
      red: 255,
      green: 0,
      blue: 255
    },
  })
  .onComplete(data => {
    const diffImageUrl = data.getImageDataUrl();
    const diffPercentage = data.misMatchPercentage;
    const diffTime = data.analysisTime;
  });`, "Resemblejs advanced example")}
                      >
                        {copiedCode?.includes("Using resemble.js for advanced") ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-white" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-2">Analysis Algorithms</h3>
                  <p className="text-muted-foreground mb-4">
                    Visually employs sophisticated algorithms to determine significance of visual changes.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">Our Analysis Includes</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Difference percentage thresholds for pass/fail determinations</li>
                      <li>Region-based analysis to ignore dynamic content</li>
                      <li>Smart detection of layout shifts vs. content changes</li>
                      <li>Anti-aliasing detection to reduce false positives</li>
                      <li>Customizable sensitivity settings per project</li>
                      <li>Visual highlighting to pinpoint exact areas of change</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-2">Architecture</h3>
                  <p className="text-muted-foreground mb-4">
                    Visually is built with a modern, scalable architecture.
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-muted p-4 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">Frontend</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>React with TypeScript</li>
                        <li>TanStack Query for data fetching</li>
                        <li>Tailwind CSS for styling</li>
                        <li>Shadcn UI for component library</li>
                        <li>Resemble.js for client-side image comparison</li>
                      </ul>
                    </div>
                    <div className="flex-1 bg-muted p-4 rounded-lg">
                      <h4 className="text-sm font-semibold mb-2">Backend</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Node.js API with Express</li>
                        <li>Server-side image processing with resemble.js</li>
                        <li>Optimized storage for baseline images</li>
                        <li>Webhooks for CI/CD integration</li>
                        <li>RESTful API for test management</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-2">Performance Optimizations</h3>
                  <p className="text-muted-foreground mb-4">
                    Visual testing can be resource-intensive, so we've implemented several optimizations:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Parallel processing of multiple image comparisons</li>
                      <li>Selective comparison using the largeImageThreshold setting</li>
                      <li>Efficient caching of baseline images</li>
                      <li>Optimized diff generation to minimize memory usage</li>
                      <li>Progressive JPEG and WebP support for faster image loading</li>
                      <li>Canvas-based image processing for optimal performance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DocumentationPage;
