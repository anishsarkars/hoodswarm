import Link from "next/link";
import { LogoMark } from "@/components/nav/Logo";

export default function NotFound() {
  return (
    <div className="container-content flex min-h-[60vh] flex-col items-center justify-center text-center">
      <LogoMark className="h-10 w-10" />
      <h1 className="mt-6 text-5xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-content-secondary">
        This conviction hasn't been formed yet.
      </p>
      <Link href="/" className="btn-primary mt-6 h-11 px-6">
        Back home
      </Link>
    </div>
  );
}
