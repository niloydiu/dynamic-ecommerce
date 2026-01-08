import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-background to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Discover Your Next Favorite Product
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance">
              Browse our curated collection of premium products. Fast shipping,
              secure checkout, and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Shopping
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/catalog?category=new">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                >
                  Browse New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section id="featured" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our handpicked selection of trending products loved by our
              customers
            </p>
          </div>

          {/* Products Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Placeholder */}
                <div className="w-full h-64 bg-muted flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">
                    Product Image
                  </div>
                </div>
                {/* Product Info */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg">Premium Product {i}</h3>
                  <p className="text-sm text-muted-foreground">
                    High-quality product with exceptional design and
                    functionality
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-lg">
                      ${(99.99 + i * 10).toFixed(2)}
                    </span>
                    <Button size="sm" variant="default">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/catalog">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On orders over $50. Fast and reliable delivery
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">
                Your payment information is always protected
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day return policy with no questions asked
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
