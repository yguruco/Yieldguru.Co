// Create a simple user store to track user logins

import { create } from "zustand"
import { persist } from "zustand/middleware"

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

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "Admin",
          status: "Active",
          lastLogin: "2023-05-15 09:32",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah.j@metrotransit.com",
          role: "Operator",
          status: "Active",
          lastLogin: "2023-05-14 14:21",
        },
        {
          id: "3",
          name: "Michael Chen",
          email: "m.chen@greeninvestment.com",
          role: "Investor",
          status: "Active",
          lastLogin: "2023-05-15 11:05",
        },
        {
          id: "4",
          name: "David Rodriguez",
          email: "d.rodriguez@ecodelivery.com",
          role: "Operator",
          status: "Active",
          lastLogin: "2023-05-13 16:47",
        },
        {
          id: "5",
          name: "Emma Wilson",
          email: "emma.w@example.com",
          role: "Investor",
          status: "Inactive",
          lastLogin: "2023-05-01 10:23",
        },
      ],
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),
      updateUserLastLogin: (id) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  lastLogin: new Date()
                    .toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .replace(",", ""),
                }
              : user,
          ),
        })),
      getUsers: () => get().users,
    }),
    {
      name: "user-storage",
    },
  ),
)
