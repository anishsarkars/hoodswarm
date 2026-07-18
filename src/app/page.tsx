import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { BeliefListFeed } from "@/components/thesis/ThesisListFeed";

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section className="container-narrow pb-20 pt-8">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="section-label">Recent Beliefs</h2>
          <Link
            href="/beliefs"
            className="flex items-center gap-1 text-sm font-medium text-content-secondary transition-colors hover:text-white"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <BeliefListFeed showFilters={false} pageSize={6} />
      </section>
    </div>
  );
}
