import Link from "next/link"

export default function FooterSection() {
  return (
    <footer className="bg-gradient-to-b from-[#4f1964] to-gray-900 py-12 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center">
              <div className="mr-2 h-8 w-8 rounded-full bg-[#fbdc3e]"></div>
              <span className="text-xl font-bold">YieldGuru</span>
            </div>
            <p className="mb-4 text-gray-300">
              Revolutionizing EV asset tokenization with secure, transparent, and efficient investment opportunities.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" label="Twitter" icon="twitter" />
              <SocialLink href="#" label="LinkedIn" icon="linkedin" />
            </div>
          </div>
          <FooterLinks
            title="Platform"
            links={[
              { label: "Admin Dashboard", href: "#" },
              { label: "Investor Dashboard", href: "#" },
              { label: "EV-Operator Dashboard", href: "#" },
              { label: "Asset Marketplace", href: "#" },
            ]}
          />
          <FooterLinks
            title="Resources"
            links={[
              { label: "Documentation", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Case Studies", href: "#" },
              { label: "FAQ", href: "#" },
            ]}
          />
          <FooterLinks
            title="Company"
            links={[
              { label: "About Us", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Contact", href: "#" },
              { label: "Privacy Policy", href: "#" },
            ]}
          />
        </div>
        <div className="mt-12 border-t border-[#f68b27]/20 pt-8 text-center">
          <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} YieldGuru. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

interface SocialLinkProps {
  href: string
  label: string
  icon: "twitter" | "linkedin"
}

function SocialLink({ href, label, icon }: SocialLinkProps) {
  return (
    <a href={href} className="text-gray-300 hover:text-[#fbdc3e] transition-colors duration-200">
      <span className="sr-only">{label}</span>
      {icon === "twitter" ? (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ) : (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )}
    </a>
  )
}

interface FooterLinksProps {
  title: string
  links: { label: string; href: string }[]
}

function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-[#fbdc3e]">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href} className="text-gray-300 hover:text-[#f68b27] transition-colors duration-200">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
