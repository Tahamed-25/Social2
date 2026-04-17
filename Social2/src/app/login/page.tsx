import LoginForm from "@/components/auth/login-form";
import Logo from "@/components/logo";

export default function LoginPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Logo className="mb-4 inline-flex" />
          <h1 className="font-headline text-2xl font-bold">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
