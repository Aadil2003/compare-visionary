import { ApiResponse, Project, Snapshot, Test } from "@/types/models";
import { toast } from "sonner";
import { compareImages, isSignificantChange } from "@/utils/imageComparison";

// Mock data for our demo
const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "E-commerce Website",
    description: "Main company store",
    token: "tk_ecomm_1234567890",
    createdAt: "2023-09-15T12:00:00Z",
    updatedAt: "2023-10-20T14:30:00Z",
    testCount: 36,
    snapshots: 124,
  },
  {
    id: "proj-2",
    name: "Admin Dashboard",
    description: "Internal admin portal",
    token: "tk_admin_0987654321",
    createdAt: "2023-08-10T09:15:00Z",
    updatedAt: "2023-10-22T11:45:00Z",
    testCount: 18,
    snapshots: 72,
  },
  {
    id: "proj-3",
    name: "Mobile App",
    description: "iOS and Android application",
    token: "tk_mobile_1357924680",
    createdAt: "2023-07-05T15:30:00Z",
    updatedAt: "2023-10-21T16:20:00Z",
    testCount: 42,
    snapshots: 167,
  },
];

const MOCK_TESTS: Record<string, Test[]> = {
  "proj-1": [
    {
      id: "test-1",
      projectId: "proj-1",
      name: "Homepage Layout",
      status: "failed",
      createdAt: "2023-10-19T08:30:00Z",
      updatedAt: "2023-10-20T09:15:00Z",
      browser: "Chrome",
      viewport: "1920x1080",
      snapshotCount: 8,
    },
    {
      id: "test-2",
      projectId: "proj-1",
      name: "Product Page",
      status: "passed",
      createdAt: "2023-10-19T10:00:00Z",
      updatedAt: "2023-10-20T11:30:00Z",
      browser: "Firefox",
      viewport: "1366x768",
      snapshotCount: 12,
    },
    {
      id: "test-3",
      projectId: "proj-1",
      name: "Checkout Flow",
      status: "pending",
      createdAt: "2023-10-20T13:45:00Z",
      updatedAt: "2023-10-20T14:30:00Z",
      browser: "Safari",
      viewport: "1440x900",
      snapshotCount: 6,
    },
  ],
  "proj-2": [
    {
      id: "test-4",
      projectId: "proj-2",
      name: "Dashboard Overview",
      status: "passed",
      createdAt: "2023-10-21T09:00:00Z",
      updatedAt: "2023-10-22T10:30:00Z",
      browser: "Chrome",
      viewport: "1920x1080",
      snapshotCount: 4,
    },
    {
      id: "test-5",
      projectId: "proj-2",
      name: "User Management",
      status: "failed",
      createdAt: "2023-10-21T11:15:00Z",
      updatedAt: "2023-10-22T11:45:00Z",
      browser: "Edge",
      viewport: "1600x900",
      snapshotCount: 7,
    },
  ],
  "proj-3": [
    {
      id: "test-6",
      projectId: "proj-3",
      name: "Login Screen",
      status: "passed",
      createdAt: "2023-10-20T14:00:00Z",
      updatedAt: "2023-10-21T15:30:00Z",
      browser: "Mobile Safari",
      viewport: "375x812",
      snapshotCount: 3,
    },
    {
      id: "test-7",
      projectId: "proj-3",
      name: "Profile Settings",
      status: "passed",
      createdAt: "2023-10-20T16:45:00Z",
      updatedAt: "2023-10-21T16:20:00Z",
      browser: "Chrome Mobile",
      viewport: "360x740",
      snapshotCount: 5,
    },
  ],
};

const MOCK_SNAPSHOTS: Record<string, Snapshot[]> = {
  "test-1": [
    {
      id: "snap-1",
      testId: "test-1",
      projectId: "proj-1",
      name: "Hero Section",
      status: "failed",
      baselineUrl: "https://picsum.photos/id/10/1200/800",
      currentUrl: "https://picsum.photos/id/20/1200/800",
      diffUrl: "https://picsum.photos/id/30/1200/800",
      diffPercentage: 12.8,
      createdAt: "2023-10-20T09:00:00Z",
      updatedAt: "2023-10-20T09:15:00Z",
      browser: "Chrome",
      viewport: "1920x1080",
    },
    {
      id: "snap-2",
      testId: "test-1",
      projectId: "proj-1",
      name: "Navigation Menu",
      status: "approved",
      baselineUrl: "https://picsum.photos/id/40/1200/800",
      currentUrl: "https://picsum.photos/id/40/1200/800",
      diffUrl: null,
      diffPercentage: 0,
      createdAt: "2023-10-20T09:05:00Z",
      updatedAt: "2023-10-20T09:15:00Z",
      browser: "Chrome",
      viewport: "1920x1080",
    },
  ],
  "test-2": [
    {
      id: "snap-3",
      testId: "test-2",
      projectId: "proj-1",
      name: "Product Details",
      status: "approved",
      baselineUrl: "https://picsum.photos/id/50/1200/800",
      currentUrl: "https://picsum.photos/id/50/1200/800",
      diffUrl: null,
      diffPercentage: 0,
      createdAt: "2023-10-20T11:00:00Z",
      updatedAt: "2023-10-20T11:30:00Z",
      browser: "Firefox",
      viewport: "1366x768",
    },
  ],
  "test-6": [
    {
      id: "snap-4",
      testId: "test-6",
      projectId: "proj-3",
      name: "Login Form",
      status: "new",
      baselineUrl: null,
      currentUrl: "https://picsum.photos/id/60/800/1600",
      diffUrl: null,
      diffPercentage: null,
      createdAt: "2023-10-21T15:00:00Z",
      updatedAt: "2023-10-21T15:30:00Z",
      browser: "Mobile Safari",
      viewport: "375x812",
    },
  ],
};

// Helper for simulating API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate a random ID
const generateId = (prefix: string) => {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
};

// API Client
class ApiClient {
  // Projects API
  async getProjects(): Promise<ApiResponse<Project[]>> {
    try {
      // Simulate API delay
      await delay(800);
      return {
        data: MOCK_PROJECTS,
        status: 200,
      };
    } catch (error) {
      toast.error("Failed to fetch projects");
      console.error(error);
      throw error;
    }
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    try {
      await delay(600);
      const project = MOCK_PROJECTS.find(p => p.id === id);
      
      if (!project) {
        throw new Error("Project not found");
      }
      
      return {
        data: project,
        status: 200,
      };
    } catch (error) {
      toast.error("Failed to fetch project details");
      console.error(error);
      throw error;
    }
  }

  async createProject(name: string, description: string = ""): Promise<ApiResponse<Project>> {
    try {
      await delay(1000);
      
      const now = new Date().toISOString();
      const newProject: Project = {
        id: generateId("proj"),
        name,
        description,
        token: `tk_${Math.random().toString(36).substring(2, 15)}`,
        createdAt: now,
        updatedAt: now,
        testCount: 0,
        snapshots: 0,
      };
      
      MOCK_PROJECTS.unshift(newProject);
      MOCK_TESTS[newProject.id] = [];
      
      return {
        data: newProject,
        status: 201,
        message: "Project created successfully",
      };
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
      throw error;
    }
  }

  // Tests API
  async getTests(projectId: string): Promise<ApiResponse<Test[]>> {
    try {
      await delay(700);
      const tests = MOCK_TESTS[projectId] || [];
      
      return {
        data: tests,
        status: 200,
      };
    } catch (error) {
      toast.error("Failed to fetch tests");
      console.error(error);
      throw error;
    }
  }

  async getTest(id: string): Promise<ApiResponse<Test>> {
    try {
      await delay(500);
      const test = Object.values(MOCK_TESTS)
        .flat()
        .find(t => t.id === id);
      
      if (!test) {
        throw new Error("Test not found");
      }
      
      return {
        data: test,
        status: 200,
      };
    } catch (error) {
      toast.error("Failed to fetch test details");
      console.error(error);
      throw error;
    }
  }

  async createTest(projectId: string, name: string, browser: string, viewport: string): Promise<ApiResponse<Test>> {
    try {
      await delay(800);
      
      const now = new Date().toISOString();
      const newTest: Test = {
        id: generateId("test"),
        projectId,
        name,
        status: "pending",
        createdAt: now,
        updatedAt: now,
        browser,
        viewport,
        snapshotCount: 0,
      };
      
      if (!MOCK_TESTS[projectId]) {
        MOCK_TESTS[projectId] = [];
      }
      
      MOCK_TESTS[projectId].unshift(newTest);
      
      // Update project test count
      const project = MOCK_PROJECTS.find(p => p.id === projectId);
      if (project) {
        project.testCount += 1;
        project.updatedAt = now;
      }
      
      return {
        data: newTest,
        status: 201,
        message: "Test created successfully",
      };
    } catch (error) {
      toast.error("Failed to create test");
      console.error(error);
      throw error;
    }
  }

  // Snapshots API
  async getSnapshots(testId: string): Promise<ApiResponse<Snapshot[]>> {
    try {
      await delay(600);
      const snapshots = MOCK_SNAPSHOTS[testId] || [];
      
      return {
        data: snapshots,
        status: 200,
      };
    } catch (error) {
      toast.error("Failed to fetch snapshots");
      console.error(error);
      throw error;
    }
  }

  async getSnapshot(id: string): Promise<ApiResponse<Snapshot>> {
    try {
      await delay(400);
      const snapshot = Object.values(MOCK_SNAPSHOTS)
        .flat()
        .find(s => s.id === id);
      
      if (!snapshot) {
        throw new Error("Snapshot not found");
      }
      
      return {
        data: snapshot,
        status: 200,
      };
    } catch (error) {
      toast.error("Failed to fetch snapshot details");
      console.error(error);
      throw error;
    }
  }

  async compareSnapshotImages(baselineUrl: string, currentUrl: string): Promise<{ diffPercentage: number, diffImageUrl: string }> {
    try {
      // Use the compareImages utility function to perform the comparison
      const result = await compareImages(baselineUrl, currentUrl);
      return result;
    } catch (error) {
      console.error("Error comparing images:", error);
      toast.error("Failed to compare images");
      throw error;
    }
  }

  async approveSnapshot(id: string): Promise<ApiResponse<Snapshot>> {
    try {
      await delay(1000);
      
      const snapshot = Object.values(MOCK_SNAPSHOTS)
        .flat()
        .find(s => s.id === id);
      
      if (!snapshot) {
        throw new Error("Snapshot not found");
      }
      
      // Update the snapshot status
      snapshot.status = "approved";
      snapshot.updatedAt = new Date().toISOString();
      
      return {
        data: snapshot,
        status: 200,
        message: "Snapshot approved successfully",
      };
    } catch (error) {
      toast.error("Failed to approve snapshot");
      console.error(error);
      throw error;
    }
  }

  async rejectSnapshot(id: string): Promise<ApiResponse<Snapshot>> {
    try {
      await delay(1000);
      
      const snapshot = Object.values(MOCK_SNAPSHOTS)
        .flat()
        .find(s => s.id === id);
      
      if (!snapshot) {
        throw new Error("Snapshot not found");
      }
      
      // Update the snapshot status
      snapshot.status = "rejected";
      snapshot.updatedAt = new Date().toISOString();
      
      return {
        data: snapshot,
        status: 200,
        message: "Snapshot rejected",
      };
    } catch (error) {
      toast.error("Failed to reject snapshot");
      console.error(error);
      throw error;
    }
  }

  async setAsBaseline(snapshotId: string): Promise<ApiResponse<Snapshot>> {
    try {
      await delay(1000);
      
      const snapshot = Object.values(MOCK_SNAPSHOTS)
        .flat()
        .find(s => s.id === snapshotId);
      
      if (!snapshot) {
        throw new Error("Snapshot not found");
      }
      
      // Set current image as baseline
      snapshot.baselineUrl = snapshot.currentUrl;
      snapshot.diffUrl = null;
      snapshot.diffPercentage = 0;
      snapshot.status = "approved";
      snapshot.updatedAt = new Date().toISOString();
      
      return {
        data: snapshot,
        status: 200,
        message: "Snapshot set as baseline",
      };
    } catch (error) {
      toast.error("Failed to set snapshot as baseline");
      console.error(error);
      throw error;
    }
  }

  // Token API
  async generateToken(projectId: string): Promise<ApiResponse<{ token: string }>> {
    try {
      await delay(1200);
      
      const project = MOCK_PROJECTS.find(p => p.id === projectId);
      
      if (!project) {
        throw new Error("Project not found");
      }
      
      const newToken = `tk_${Math.random().toString(36).substring(2, 15)}`;
      project.token = newToken;
      project.updatedAt = new Date().toISOString();
      
      return {
        data: { token: newToken },
        status: 200,
        message: "New token generated successfully",
      };
    } catch (error) {
      toast.error("Failed to generate new token");
      console.error(error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
