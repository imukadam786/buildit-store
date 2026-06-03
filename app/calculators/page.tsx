import type { Metadata } from "next";
import { Calculators } from "@/components/calculators";

export const metadata: Metadata = {
  title: "Material calculators",
  description: "Work out how much paint, tiles, bricks or concrete you need for your project.",
};

export default function CalculatorsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-black text-ink">Material calculators</h1>
      <p className="mt-2 text-muted">
        Quick estimates for your project. Pop in a few measurements and we&apos;ll tell you roughly how much you need — then shop it.
      </p>
      <div className="mt-6">
        <Calculators />
      </div>
    </div>
  );
}
