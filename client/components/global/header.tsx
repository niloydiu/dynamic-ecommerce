"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Search, Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useCart } from "@/modules/cart/hooks"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              NC
            </div>
            <span className="hidden sm:inline">NexusCommerce</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/catalog?category=new" className="text-sm font-medium hover:text-primary transition-colors">
              New Arrivals
            </Link>
            <Link href="/catalog?category=sale" className="text-sm font-medium hover:text-primary transition-colors">
              Sale
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:flex items-center bg-muted rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                className="ml-2 flex-1 bg-transparent text-sm outline-none"
              />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" aria-label="Shopping cart" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs flex items-center justify-center rounded-full font-semibold">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account Menu */}
            <Link href="/auth/sign-in">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border space-y-2">
            <Link href="/catalog" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link
              href="/catalog?category=new"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              New Arrivals
            </Link>
            <Link
              href="/catalog?category=sale"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
            >
              Sale
            </Link>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center bg-muted rounded-lg px-3 py-2 mt-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="ml-2 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
