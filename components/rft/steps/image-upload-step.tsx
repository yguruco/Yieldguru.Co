"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ImageUploadStepProps {
  onImagesUploaded: (images: string[]) => void
  existingImages: string[]
}

export function ImageUploadStep({ onImagesUploaded, existingImages }: ImageUploadStepProps) {
  const [images, setImages] = useState<string[]>(existingImages || [])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setError(null)

    // Check file count
    if (files.length > 5 || images.length + files.length > 5) {
      setError("You can upload a maximum of 5 images")
      return
    }

    // Process each file
    Array.from(files).forEach((file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed")
        return
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should not exceed 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          const newImages = [...images, e.target.result.toString()]
          setImages(newImages)
          onImagesUploaded(newImages)
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onImagesUploaded(newImages)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Upload Vehicle Images</h2>
        <p className="text-gray-500">
          Please upload clear images of your vehicle from different angles. Include exterior, interior, and any special
          features.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Image preview cards */}
        {images.map((image, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Vehicle image ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium">Image {index + 1}</p>
            </CardContent>
          </Card>
        ))}

        {/* Upload button card */}
        {images.length < 5 && (
          <Card className="border-dashed">
            <CardContent className="p-0">
              <label className="flex flex-col items-center justify-center w-full h-full aspect-video cursor-pointer p-6">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG (max 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
              </label>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{images.length} of 5 images uploaded</p>

        {images.length > 0 && (
          <div className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Images uploaded</span>
          </div>
        )}
      </div>
    </div>
  )
}
