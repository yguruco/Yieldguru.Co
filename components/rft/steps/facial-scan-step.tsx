"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Camera, RefreshCw, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FacialScanStepProps {
  onScanComplete: (scanData: string) => void
  existingScanData: string | null
}

export function FacialScanStep({ onScanComplete, existingScanData }: FacialScanStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [scanComplete, setScanComplete] = useState(!!existingScanData)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [scanMethod, setScanMethod] = useState<"camera" | "upload">("camera")
  const [countdown, setCountdown] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      // Clean up camera stream when component unmounts
      stopCameraStream()
    }
  }, [])

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const startCamera = async () => {
    try {
      setErrorMessage(null)

      // First check if user media is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera access. Please try uploading an image instead.")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
            setIsCameraActive(true)
          }
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setErrorMessage(
        "Unable to access camera. Please ensure you've granted camera permissions or try uploading an image instead.",
      )
    }
  }

  const startCountdown = () => {
    setCountdown(3)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer)
          takePicture()
          return null
        }
        return prev ? prev - 1 : null
      })
    }, 1000)
  }

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL("image/png")

        // Stop camera stream
        stopCameraStream()

        // Update state
        setIsCameraActive(false)
        setScanComplete(true)

        // Pass data to parent
        onScanComplete(dataUrl)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size should not exceed 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result.toString()
        setScanComplete(true)
        onScanComplete(dataUrl)
      }
    }
    reader.onerror = () => {
      setErrorMessage("Error reading file")
    }
    reader.readAsDataURL(file)
  }

  const resetScan = () => {
    setScanComplete(false)
    setIsCameraActive(false)
    stopCameraStream()
    setErrorMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Facial Scan</h2>
        <p className="text-gray-500">
          We need to verify your identity. Please look directly at the camera or upload a clear photo of your face.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="camera" onValueChange={(value) => setScanMethod(value as "camera" | "upload")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera">Use Camera</TabsTrigger>
          <TabsTrigger value="upload">Upload Photo</TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="pt-4">
          <div className="flex justify-center">
            <Card className="overflow-hidden w-full max-w-md">
              {scanComplete ? (
                <div className="relative">
                  <canvas ref={canvasRef} className="w-full h-auto" />
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <div className="bg-green-500 text-white p-3 rounded-full">
                      <Check className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                  {isCameraActive ? (
                    <>
                      <video ref={videoRef} autoPlay playsInline className="w-full h-auto" muted />
                      {countdown !== null && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="text-6xl font-bold text-white">{countdown}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">Camera is not active</p>
                      <p className="text-sm text-gray-400 mt-2">Click "Start Camera" below to begin</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            {scanComplete ? (
              <Button variant="outline" onClick={resetScan} className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake Scan
              </Button>
            ) : isCameraActive ? (
              <Button onClick={startCountdown} className="bg-[#f68b27] hover:bg-[#f68b27]/90">
                Capture (3s countdown)
              </Button>
            ) : (
              <Button onClick={startCamera} className="bg-[#f68b27] hover:bg-[#f68b27]/90">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="pt-4">
          <div className="flex justify-center">
            <Card className="overflow-hidden w-full max-w-md">
              {scanComplete ? (
                <div className="relative">
                  <img src={existingScanData || ""} alt="Facial scan" className="w-full h-auto" />
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                    <div className="bg-green-500 text-white p-3 rounded-full">
                      <Check className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 aspect-video flex items-center justify-center p-6">
                  <div className="text-center">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-[#f68b27]"
                      onClick={triggerFileUpload}
                    >
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">Click to upload a photo</p>
                      <p className="text-sm text-gray-400 mt-2">PNG, JPG or JPEG (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            {scanComplete ? (
              <Button variant="outline" onClick={resetScan} className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Upload Different Photo
              </Button>
            ) : (
              <Button onClick={triggerFileUpload} className="bg-[#f68b27] hover:bg-[#f68b27]/90">
                <Camera className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
