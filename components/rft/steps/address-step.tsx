"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
})

interface AddressStepProps {
  onAddressSubmitted: (address: string) => void
  existingAddress: string
}

export function AddressStep({ onAddressSubmitted, existingAddress }: AddressStepProps) {
  const [isSubmitted, setIsSubmitted] = useState(!!existingAddress)

  // Parse existing address if available
  const parseExistingAddress = () => {
    if (!existingAddress) return {}

    try {
      const parsed = JSON.parse(existingAddress)
      return {
        streetAddress: parsed.streetAddress || "",
        city: parsed.city || "",
        state: parsed.state || "",
        zipCode: parsed.zipCode || "",
        country: parsed.country || "",
        walletAddress: parsed.walletAddress || "",
      }
    } catch (e) {
      return {}
    }
  }

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: parseExistingAddress(),
  })

  const onSubmit = (data: z.infer<typeof addressSchema>) => {
    const addressString = JSON.stringify(data)
    onAddressSubmitted(addressString)
    setIsSubmitted(true)
  }

  const editAddress = () => {
    setIsSubmitted(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Operator Address</h2>
        <p className="text-gray-500">
          Please provide your physical address and wallet address for tokenization purposes.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-500 rounded-full p-1 mr-3">
              <Check className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-medium text-green-800">Address Submitted</h3>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            {Object.entries(parseExistingAddress()).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium w-32 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                <span>{value as string}</span>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={editAddress} className="mt-4">
            Edit Address
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="State or Province" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP/Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="ZIP or Postal Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your blockchain wallet address" {...field} />
                  </FormControl>
                  <FormDescription>This address will be used for tokenization and receiving payments.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-[#f68b27] hover:bg-[#f68b27]/90">
              <MapPin className="mr-2 h-4 w-4" />
              Save Address
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
