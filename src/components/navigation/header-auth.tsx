"use client";

import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";
import { Button } from "../ui/button";
import { NavUser } from "./nav-user";

export default function AuthButtons() {
  const { user, loading } = useAuth();

  if (!loading)
  return user ? (
      <NavUser user={{
        name: user.username,
        email: user.email,
        avatar: user.profile_picture
      }}/>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up/credentials">Sign up</Link>
      </Button>
    </div>
  );
}
