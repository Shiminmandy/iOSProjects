import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

type Props = {
    type: "login" | "signUp";
  };

export const AuthForm = ({ type }: Props) => {

    const isLoginForm = type === "login";

  const router = useRouter();


  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    
  }

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
         
        </p>
      </CardFooter>
    </form>
  );
}