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
      "With YieldGuru we have been able to enter into a financing partnership to increase our electric vans fleet from 2 to 50 vans plying the Ruiru - Ruaka - Westlands routes, and more routes are opening up",
    author: "Sam Kamau",
    title: "CEO - Sony Classic Shuttles",
  },
  {
    quote:
      "This new investing platform is creating a massive opportunity to drive professionalism in the matatu industry, and our workers now have an easy transparent way they can actually easily own the matatus they operate on the road",
    author: "Nyambura Githiga",
    title: "Federation of Drivers and Conductors Kenya (FEDCO)",
  },
  {
    quote:
      "We are working with YieldGuru to launch the first National EV Buses Sacco in Kenya. We will enable our members transition 100% to electric buses, with cheaper financing alternatives",
    author: "Bernard Odero",
    title: "Research & Strategy at Africa Insights",
  },
]
