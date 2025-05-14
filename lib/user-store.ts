// Temporary placeholder for user-store

import { create } from "zustand"

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Investor" | "Operator"
  lastLogin: string
  status: "Active" | "Inactive" | "Pending"
}

interface UserState {
  users: User[]
  addUser: (user: User) => void
  updateUserLastLogin: (id: string) => void
  getUsers: () => User[]
}

// Create a simple placeholder store with no actual data
export const useUserStore = create<UserState>()((set, get) => ({
  users: [],
  addUser: () => {},
  updateUserLastLogin: () => {},
  getUsers: () => []
})) 