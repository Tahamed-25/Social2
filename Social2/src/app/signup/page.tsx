import SignupForm from "@/components/auth/signup-form";
import Logo from "@/components/logo";

export default function SignupPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Logo className="mb-4 inline-flex" />
          <h1 className="font-headline text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Join the Social-fit community today!
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
