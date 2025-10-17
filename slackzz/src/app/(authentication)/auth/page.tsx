"use client";
import { BsSlack } from "react-icons/bs";
import Typography from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { RxGithubLogo } from "react-icons/rx";
import { FaRegEnvelope } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Provider } from "@supabase/supabase-js";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { useState } from "react";
import { supabaseBrowserClient } from "@/supabase/supabaseClient";

const AuthPage = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const formSchema = z.object({
    email: z.string().email().min(2, { message: "Email must be 2 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log("test");
  }

  async function socialAuth(provider: Provider) {
    setIsAuthenticating(true);
    await supabaseBrowserClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `http://example.com/auth/callback`,
      },
    });
    setIsAuthenticating(false);
  }

  return (
    <div className="min-h-screen p-5 grid text-center place-content-center bg-white">
      <div className="max-w-[450px] ">
        <div className="flex justify-center items-center gap-3 mb-4">
          <BsSlack size={30} />
          <Typography variant="h2" text="Slackzz" />
        </div>

        <Typography
          variant="h2"
          text="Sign in to your Slackzz"
          className="mb-3"
        />

        <Typography
          variant="p"
          text="We suggest using the email address that you use at work"
          className="opacity-90 mb-7"
        />

        <div className="flex flex-col space-y-4">
          <Button
            variant="outline"
            className="py-6 border-2 flex space-x-3"
            disabled={isAuthenticating}
            onClick={() => socialAuth("google")}
          >
            <FcGoogle size={30} />
            <Typography
              variant="p"
              text="Sign in with Google"
              className="text-xl"
            />
          </Button>
          <Button
            variant="outline"
            className="py-6 border-2 flex space-x-3"
            disabled={isAuthenticating}
          >
            <RxGithubLogo size={30} />
            <Typography
              variant="p"
              text="Sign in with Github"
              className="text-xl"
            />
          </Button>
        </div>

        <div>
          <div className="flex items-center my-6">
            <div className="mr-[10px] flex-1 border-t bg-neutral-300" />
            <Typography text="OR" variant="p" />
            <div className="ml-[10px] flex-1 border-t bg-neutral-300" />
          </div>

          {/* FORM   fieldset的作用是语义化分组 */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isAuthenticating}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="name@work-email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  variant="secondary"
                  className="bg-primary-dark hover:bg-primary-dark/90 w-full my-5 text-white"
                  type="submit"
                  disabled={isAuthenticating}
                >
                  <Typography text="Sign in with Email" variant="p" />
                </Button>

                <div className="px-5 py-4 bg-gray-100 rounded-sm">
                  <div className="text-gray-500 flex items-center space-x-3">
                    <MdOutlineAutoAwesome />
                    <Typography
                      text="We will email you a magic link for a password-free sign in."
                      variant="p"
                    />
                  </div>
                </div>
              </fieldset>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
