import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-auto bg-secondary text-secondary-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                NC
              </div>
              <span>NexusCommerce</span>
            </div>
            <p className="text-sm opacity-75">
              Your trusted destination for premium products and exceptional shopping experiences.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/catalog" className="hover:opacity-100 transition-opacity">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=new" className="hover:opacity-100 transition-opacity">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=sale" className="hover:opacity-100 transition-opacity">
                  Sale Items
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=featured" className="hover:opacity-100 transition-opacity">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="#" className="hover:opacity-100 transition-opacity">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition-opacity">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition-opacity">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition-opacity">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="#" className="hover:opacity-100 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition-opacity">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition-opacity">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:opacity-100 transition-opacity">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-8">
          <p className="text-center text-sm opacity-50">© 2026 NexusCommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
