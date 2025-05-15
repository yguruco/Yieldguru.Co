import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function AssetShowcaseSection() {
  return (
    <section className="bg-white py-20" id="pricing">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Diverse EV Asset Classes</h2>
          <p className="text-lg text-gray-600">
            YieldGuru supports investing in tokenized EV loans across various vehicle classes.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset, index) => (
            <AssetCard key={index} {...asset} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface AssetCardProps {
  title: string
  description: string
  imageSrc: string
}

function AssetCard({ title, description, imageSrc }: AssetCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-6">
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

const assets = [
  {
    title: "Commercial Vans",
    description: "Last-mile delivery fleets with predictable routes and utilization patterns.",
    imageSrc: "/images/ford-vehicle.jpeg",
  },
  {
    title: "Electric Buses",
    description: "Public transportation vehicles with long operational lifespans and stable returns.",
    imageSrc: "/images/electric-bus.jpeg",
  },
  {
    title: "Utility Vehicles",
    description: "Specialized EVs for municipal services and corporate fleets.",
    imageSrc: "/images/ford.jpeg",
  },
]
