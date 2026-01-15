// Helper to create test server
// This is a placeholder - in a real Next.js app, you'd use a test server setup
export function createServer() {
  // This would typically use a Next.js test server or mock
  // For now, return a mock object
  return {
    post: (path: string) => ({
      send: (data: any) => Promise.resolve({ status: 200, body: {} }),
    }),
  };
}
