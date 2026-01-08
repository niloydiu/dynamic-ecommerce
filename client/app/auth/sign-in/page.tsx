import { SignInForm } from "@/modules/auth/components/sign-in-form"

export const metadata = {
  title: "Sign In - NexusCommerce",
  description: "Sign in to your NexusCommerce account",
}

export default function SignInPage() {
  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue shopping</p>
          </div>

          <div className="flex justify-center">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  )
}
