import TestimonialCard from "@/components/testimonial-card"

export default function TestimonialsSection() {
  return (
    <section className="bg-[#4f1964] py-20 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Industry Leaders</h2>
          <p className="text-lg text-white/80">
            Hear from our partners who are transforming the EV investment landscape.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}


/*
[

  {
    quote:
      "We used YieldGuru’s dashboard to restructure our EV routes — ended up saving on energy costs and cutting idle time. Real value.",
    author: "David Rodriguez",
    title: "Operations Lead at EcoDelivery",
  },
  {
    quote:
      "At BuidlLabz, we’re always exploring practical blockchain infra. Ivy here — and I can say YieldGuru’s approach to real-world asset tokenization is one of the cleanest I’ve seen.",
    author: "Ivy Njeri",
    title: "Co-founder at BuidlLabz",
  },
  {
    quote:
      "As someone building infra at MVLO Chain, I respect how YieldGuru bridges asset performance with real-time investor visibility. It’s not just hype.",
    author: "ClimbingK",
    title: "Co-founder at MVLO Chain",
  },
]

*
*/

const testimonials = [
  {
    quote:
      "Getting our electric buses funded used to take months  with YieldGuru, we closed our last round in under two weeks. It’s a game-changer for transit expansion.",
    author: "Sarah Johnson",
    title: "Fleet Manager at MetroTransit",
  },
  {
    quote:
      "I started small, but now YieldGuru is a core part of my portfolio. Reliable returns, clear reporting — finally, something in Web3 that just works.",
    author: "Michael Chen",
    title: "Director at Green Investment Partners",
  },
  {
    quote:
      "We’ve been tracking EV asset trends across Africa, and YieldGuru has one of the most actionable models for deploying capital transparently.",
    author: "Kelvin Johnsone",
    title: "Research & Strategy at Africa Insights",
  },
]
