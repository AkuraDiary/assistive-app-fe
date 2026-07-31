import { mockUsers } from './dashboard.mock'

export function getMockUser(email: string) {
  // Check the dynamic mockUsers from account management first
  const dbUser = mockUsers.find(u => u.email === email)
  
  if (dbUser) {
    if (dbUser.status !== 'aktif') {
      return null // Will fall through and fail login
    }
    return {
      token: `dummy-token-${dbUser._id}`,
      user: {
        id: dbUser._id,
        email: dbUser.email,
        fullName: dbUser.name,
        role: dbUser.roleName.toLowerCase(),
      },
    }
  }

  // Fallback to hardcoded roles for backwards compatibility
  const dummyRoles: Record<string, string> = {
    'parent@test.com': 'parent',
    'teacher@test.com': 'teacher',
    'institution@test.com': 'institution',
    'admin@test.com': 'admin',
  }

  const role = dummyRoles[email]
  if (!role) return null

  return {
    token: `dummy-token-${role}`,
    user: {
      id: `dummy-id-${role}`,
      email: email,
      fullName: `Dummy ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      role: role,
    },
  }
}
