import { SignUpForm } from "@/modules/auth/components/sign-up-form"

export const metadata = {
  title: "Sign Up - NexusCommerce",
  description: "Create a new NexusCommerce account",
}

export default function SignUpPage() {
  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Create Account</h1>
            <p className="text-muted-foreground">Join NexusCommerce to start shopping</p>
          </div>

          <div className="flex justify-center">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  )
}
