import { verifySessionCookies } from "@/lib/data-access-layer";
import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await verifySessionCookies();
  if (session) redirect("/app/inbox");

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-12 items-center">
        <div className="flex gap-3 items-center">
          <CheckCircle className="size-8" />
          <span className="text-4xl font-semibold">Tugas</span>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="outline">
            <Link href="/auth/signup">Sign up</Link>
          </Button>
          <Button>
            <Link href="/auth/login">Log in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
