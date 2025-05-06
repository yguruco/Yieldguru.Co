import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  title: string
  excerpt: string
  imageSrc: string
  date: string
  readTime: string
  category: string
  slug: string
}

export default function BlogCard({ title, excerpt, imageSrc, date, readTime, category, slug }: BlogCardProps) {
  return (
    <Link href={slug}>
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative h-48">
          <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <Badge className="absolute right-3 top-3 bg-[#4f1964]">{category}</Badge>
        </div>
        <CardContent className="p-6">
          <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
            <span>{date}</span>
            <span className="flex items-center">
              <Clock className="mr-1 h-3 w-3" />
              {readTime}
            </span>
          </div>
          <h3 className="mb-2 text-xl font-bold">{title}</h3>
          <p className="text-gray-600">{excerpt}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
