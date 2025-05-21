"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown, Plus, Minus } from "lucide-react"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  toggleOpen: () => void
  index: number
}

function FAQItem({ question, answer, isOpen, toggleOpen, index }: FAQItemProps) {
  return (
    <motion.div
      className="border-b border-gray-200 last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: isOpen ? 1 : 1.01 }}
    >
      <button
        onClick={toggleOpen}
        className="flex w-full items-center justify-between py-6 text-left font-medium text-gray-900 focus:outline-none group"
      >
        <motion.span
          className="text-lg font-semibold flex items-center faq-highlight"
          animate={{ color: isOpen ? "#4f1964" : "#1f2937" }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.8,
              color: "#4f1964"
            }}
            className="mr-3 text-[#4f1964]"
          >
            {isOpen ? "•" : ""}
          </motion.span>
          {question}
        </motion.span>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            backgroundColor: isOpen ? "rgba(79, 25, 100, 0.1)" : "transparent"
          }}
          transition={{ duration: 0.3 }}
          className="flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-[#4f1964]/10"
        >
          {isOpen ? (
          <Minus className="h-5 w-5 text-[#4f1964]" />
        ) : (
          <Plus className="h-5 w-5 text-[#4f1964]" />
        )}
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="overflow-hidden"
      >
        <motion.div
          className="pb-6 text-gray-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            y: isOpen ? 0 : -10,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="leading-relaxed">{answer}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const sectionRef = useRef<HTMLElement>(null)

  // Animation values for scroll effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity, scale }}
      className="relative bg-white py-24 mb-0"
      id="faq"
    >

      {/* Decorative elements */}
      <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-[#4f1964]/5 blur-3xl"></div>
      <div className="absolute left-0 bottom-80 h-64 w-64 rounded-full bg-[#fbdc3e]/5 blur-3xl"></div>

      <div className="container mx-auto max-w-4xl px-8 pt-8 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="relative inline-block">
              <span className="relative z-10">Frequently Asked Questions</span>
              <motion.span
                className="absolute bottom-2 left-0 h-3 w-full bg-[#fbdc3e]/30 -z-10"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              ></motion.span>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Find answers to common questions about YieldGuru's EV tokenization platform.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-3xl pb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="relative p-1 rounded-xl bg-gradient-to-br from-[#4f1964]/20 via-white to-[#fbdc3e]/20 faq-card-glow">
            <div className="bg-white rounded-lg p-6 shadow-sm shimmer">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  toggleOpen={() => toggleFAQ(index)}
                  index={index}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Direct color transition without white */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-[#4f1964]"></div>
    </motion.section>
  )
}

const faqs = [
  {
    question: "What is EV asset tokenization?",
    answer: "EV asset tokenization is the process of converting ownership rights of electric vehicles into digital tokens on a blockchain. This allows for fractional ownership, increased liquidity, and transparent tracking of asset performance and returns."
  },
  {
    question: "How does YieldGuru ensure security of tokenized assets?",
    answer: "YieldGuru employs military-grade encryption, multi-signature wallets, regular security audits, and compliance with regulatory frameworks to ensure the security of all tokenized assets on our platform."
  },
  {
    question: "What types of electric vehicles can be tokenized?",
    answer: "Our platform supports tokenization of various EV assets including commercial fleets, public transportation vehicles (buses, taxis), delivery vehicles, and specialized electric mobility solutions."
  },
  {
    question: "What are the minimum investment requirements?",
    answer: "Through fractional ownership, investors can participate with as little as $100, making EV asset investment accessible to a broader range of investors while maintaining the benefits of asset-backed returns."
  },
  {
    question: "How are returns generated and distributed?",
    answer: "Returns are generated through vehicle leasing, ride-sharing, delivery services, and other operational uses. These returns are distributed to token holders proportionally to their ownership stake, with automated payments via smart contracts."
  },
  {
    question: "Can I sell my tokens before the end of the investment term?",
    answer: "Yes, YieldGuru provides a secondary marketplace where investors can trade their tokens, providing liquidity options that traditional vehicle investments typically lack."
  }
]