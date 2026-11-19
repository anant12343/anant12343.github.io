import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-site flex-col justify-center px-4 sm:px-6 lg:px-10">
      <p className="label text-muted">Error 404</p>
      <h1 className="display mt-4 text-[clamp(4rem,16vw,14rem)]">Lost<span className="text-accent">.</span></h1>
      <Link href="/" className="mt-8 underline underline-offset-4">Back to the homepage →</Link>
    </section>
  );
}
