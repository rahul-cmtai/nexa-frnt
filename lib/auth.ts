// Authentication utilities and types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role?: "user" | "admin"
  address?: {
    street: string
    city: string
    state: string
    pincode: string
  }
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Mock user storage (in real app, this would be a backend API)
const USERS_KEY = "nexa_rest_users"
const CURRENT_USER_KEY = "nexa_rest_current_user"

export const authService = {
  // Get all users from localStorage
  getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  },

  // Save users to localStorage
  saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  // Register new user
  async register(email: string, password: string, name: string): Promise<{ user: User; error?: string }> {
    const users = this.getUsers()

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return { user: null as any, error: "User already exists with this email" }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: email === "admin@nexarest.com" ? "admin" : "user",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    this.saveUsers(users)

    // Auto login after registration
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))

    return { user: newUser }
  },

  // Login user
  async login(email: string, password: string): Promise<{ user: User; error?: string }> {
    console.log("[v0] Login attempt with:", { email, password })

    // Hardcoded password validation - check credentials first
    const validCredentials = [
      { email: "admin@nexarest.com", password: "admin123" },
      { email: "user@nexarest.com", password: "user123" },
    ]

    const validCred = validCredentials.find((cred) => cred.email === email && cred.password === password)
    console.log("[v0] Valid credential found:", !!validCred)

    if (!validCred) {
      console.log("[v0] Login failed: Invalid credentials")
      return { user: null as any, error: "Invalid email or password" }
    }

    // Create user object based on credentials
    const user: User = {
      id: email === "admin@nexarest.com" ? "admin-001" : "user-001",
      email,
      name: email === "admin@nexarest.com" ? "Admin User" : "Test User",
      role: email === "admin@nexarest.com" ? "admin" : "user",
      phone: email === "admin@nexarest.com" ? "+91 9876543210" : "+91 9876543211",
      address: {
        street: email === "admin@nexarest.com" ? "123 Admin Street" : "456 User Street",
        city: email === "admin@nexarest.com" ? "Mumbai" : "Delhi",
        state: email === "admin@nexarest.com" ? "Maharashtra" : "Delhi",
        pincode: email === "admin@nexarest.com" ? "400001" : "110001",
      },
      createdAt: new Date().toISOString(),
    }

    // Only use localStorage if we're in the browser
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    }

    console.log("[v0] Login successful for:", user.email)
    return { user }
  },

  // Logout user
  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  },

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<{ user: User; error?: string }> {
    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      return { user: null as any, error: "Not authenticated" }
    }

    const users = this.getUsers()
    const userIndex = users.findIndex((u) => u.id === currentUser.id)

    if (userIndex === -1) {
      return { user: null as any, error: "User not found" }
    }

    const updatedUser = { ...users[userIndex], ...updates }
    users[userIndex] = updatedUser

    this.saveUsers(users)
    
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser))
    }

    return { user: updatedUser }
  },

  // Helper function to check if user is admin
  isAdmin(user: User | null): boolean {
    return user?.role === "admin"
  },

  // Function to create default test users (admin and regular user)
  createDefaultUsers(): void {
    const users = this.getUsers()

    // Default Admin User
    const adminExists = users.find((u) => u.email === "admin@nexarest.com")
    if (!adminExists) {
      const adminUser: User = {
        id: "admin-001",
        email: "admin@nexarest.com",
        name: "Admin User",
        role: "admin",
        phone: "+91 9876543210",
        address: {
          street: "123 Admin Street",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400001",
        },
        createdAt: new Date().toISOString(),
      }
      users.push(adminUser)
    }

    // Default Test User
    const userExists = users.find((u) => u.email === "user@nexarest.com")
    if (!userExists) {
      const testUser: User = {
        id: "user-001",
        email: "user@nexarest.com",
        name: "Test User",
        role: "user",
        phone: "+91 9876543211",
        address: {
          street: "456 User Street",
          city: "Delhi",
          state: "Delhi",
          pincode: "110001",
        },
        createdAt: new Date().toISOString(),
      }
      users.push(testUser)
    }

    this.saveUsers(users)
  },

  // Function to create default admin user
  createDefaultAdmin(): void {
    this.createDefaultUsers() // Use the new comprehensive function
  },
}
