import { useRouter } from "next/navigation";
import { useTransition } from "react";

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
        <div>
            <h1>{type}</h1>
        </div>
    )
}