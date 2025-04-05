export const generateUserCredentials = (name: string, role: 'employee' | 'hr') => {
  // Create email from name
  const emailName = name
    .toLowerCase()
    .replace(/\s+/g, '.') // Replace spaces with dots
    .replace(/[^a-z0-9.]/g, ''); // Remove special characters
  
  const email = `${emailName}@gofloww.com`;
  const password = `${emailName}@${role}`;

  return {
    email,
    password,
    name
  };
};

// Example usage:
// const testUser = generateTestUser();
// console.log('Test User:', testUser);
// Output: { email: 'test.user.abc123@example.com', password: 'Testabc123123!', name: 'Test User abc123' } 