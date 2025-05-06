"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
      setEmail("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-md">
      <h3 className="mb-2 text-2xl font-bold text-gray-900">Stay Updated</h3>
      <p className="mb-6 text-gray-600">
        Subscribe to our newsletter for the latest insights on EV tokenization, market trends, and platform updates.
      </p>

      {isSuccess ? (
        <div className="rounded-lg bg-green-50 p-4 text-green-800">
          <p className="font-medium">Thank you for subscribing!</p>
          <p className="text-sm">You&apos;ll receive our next newsletter in your inbox.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-[#4f1964] text-white hover:bg-[#4f1964]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
          <p className="text-xs text-gray-500">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </form>
      )}
    </div>
  )
}
