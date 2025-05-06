import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-[#4f1964] to-[#6b2a8c] py-20 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Transform Your EV Investments?
          </h2>
          <p className="mb-8 text-xl text-white/90">
            Join the growing community of forward-thinking investors and operators leveraging the power of tokenization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-[#fbdc3e] text-[#4f1964] hover:bg-[#fbdc3e]/90">
              Create Account
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
