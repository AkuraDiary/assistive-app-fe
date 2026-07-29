export const dummyRoles: Record<string, string> = {
  'parent@test.com': 'parent',
  'teacher@test.com': 'teacher',
  'institution@test.com': 'institution',
  'admin@test.com': 'admin',
}

export function getMockUser(email: string) {
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
