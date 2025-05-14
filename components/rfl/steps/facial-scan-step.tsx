"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Loader2, CheckCircle2, AlertCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FacialScanStepProps {
  onScanComplete: (scanData: string) => void
  existingScanData?: string | null
}

export function FacialScanStep({ onScanComplete, existingScanData }: FacialScanStepProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isScanComplete, setIsScanComplete] = useState(!!existingScanData)
  const [isProcessing, setIsProcessing] = useState(false)
  const [facialScanData, setFacialScanData] = useState<string | null>(existingScanData || null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("camera")
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // If we already have scan data, mark as complete
    if (existingScanData) {
      setIsScanComplete(true)
      setFacialScanData(existingScanData)
    }

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [existingScanData])

  useEffect(() => {
    // Stop camera when switching to upload tab
    if (activeTab === "upload" && streamRef.current) {
      stopCamera()
    }
  }, [activeTab])

  const startCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      setError("Failed to access camera. Please check your camera permissions.")
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return
    
    setIsProcessing(true)
    
    const context = canvasRef.current.getContext("2d")
    if (!context) return
    
    // Set canvas dimensions to match video
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    
    // Draw the current video frame onto the canvas
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    
    // Get the image as a data URL
    const imageData = canvasRef.current.toDataURL("image/jpeg")
    setFacialScanData(imageData)
    
    // Simulate facial recognition processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsScanComplete(true)
      onScanComplete(imageData)
      stopCamera()
    }, 1500)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    
    const file = event.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.)")
      return
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size is too large. Please upload an image smaller than 5MB.")
      return
    }

    setIsProcessing(true)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target?.result as string
      
      // Load the image to check dimensions
      const img = new Image()
      img.onload = () => {
        // Create a canvas to resize if needed
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        // Maximum dimensions
        const MAX_WIDTH = 1280
        const MAX_HEIGHT = 960
        
        let width = img.width
        let height = img.height
        
        // Scale down if too large
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = height * (MAX_WIDTH / width)
            width = MAX_WIDTH
          } else {
            width = width * (MAX_HEIGHT / height)
            height = MAX_HEIGHT
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw and resize
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Get resized image data
        const resizedImageData = canvas.toDataURL("image/jpeg", 0.85)
        
        // Update state with the image
        setFacialScanData(resizedImageData)
        setIsScanComplete(true)
        onScanComplete(resizedImageData)
        setIsProcessing(false)
      }
      
      img.src = imageData
    }
    
    reader.onerror = () => {
      setError("Failed to read the image file. Please try again.")
      setIsProcessing(false)
    }
    
    reader.readAsDataURL(file)
  }

  const resetScan = () => {
    setFacialScanData(null)
    setIsScanComplete(false)
    onScanComplete("")
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Facial Scan</h3>
        {isScanComplete && !isCameraActive && (
          <Button variant="outline" onClick={resetScan}>
            Retake Scan
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        We need a scan of your face for identity verification. Your loan application won't be processed without a valid facial scan.
      </p>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isScanComplete && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">Use Camera</TabsTrigger>
            <TabsTrigger value="upload">Upload Photo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="camera" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-black aspect-video flex items-center justify-center">
                  {isCameraActive ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="text-center p-10">
                      <Camera className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-white">Camera inactive</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-4">
              {isCameraActive ? (
                <Button 
                  onClick={takePicture} 
                  className="gap-2 bg-[#f68b27] hover:bg-[#f68b27]/90"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Take Picture"
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={startCamera} 
                  className="gap-2 bg-[#f68b27] hover:bg-[#f68b27]/90"
                >
                  <Camera className="h-4 w-4" />
                  Start Camera
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="text-center p-10 border-2 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors" onClick={triggerFileUpload}>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Upload className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Click to upload your photo</p>
                  <p className="text-xs text-muted-foreground mt-2">JPG, PNG, or GIF. Maximum size 5MB.</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-4">
              <Button 
                onClick={triggerFileUpload} 
                className="gap-2 bg-[#f68b27] hover:bg-[#f68b27]/90"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {isScanComplete && facialScanData && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={facialScanData} 
                alt="Facial scan" 
                className="w-full h-auto max-h-[400px] object-contain"
              />
              <div className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-full">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
} 