import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ford.jpeg"
          alt="Electric vehicle on the road"
          fill
          className="object-cover object-center brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4f1964]/80 to-transparent" />
      </div>

      <div className="absolute bottom-12 left-12 z-10 max-w-xl text-left font-inter">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Invest in E-Mobility with <span className="text-yellow-300">Simplicity</span>
        </h1>
        <p className="mb-8 text-xl text-white/90">
          Yield Guru Investments is pioneering a crowd investing platform into E-mobility assets with quarterly yields. Get fractional ownership in public transport E-Buses, taxi EVs, and our network of charging stations.
        </p>
        <div className="flex flex-wrap justify-start gap-4">
          <Button size="lg" className="bg-yellow-300 text-purple-900 hover:bg-yellow-300/90">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-yelow-300/90 hover:bg-white/10">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
