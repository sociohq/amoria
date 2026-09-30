export default function ProductLoading() {
  return (
    <div className="grid animate-pulse gap-12 px-6 py-12 lg:grid-cols-2">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="aspect-square bg-cream-dark lg:aspect-auto lg:h-[calc(100vh-14rem)]" />
      </div>
      <div className="flex flex-col gap-4 py-4">
        <div className="h-4 w-24 bg-cream-dark" />
        <div className="h-8 w-3/4 bg-cream-dark" />
        <div className="h-4 w-40 bg-cream-dark" />
        <div className="h-6 w-32 bg-cream-dark" />
        <div className="mt-4 h-24 w-full bg-cream-dark" />
        <div className="mt-4 h-12 w-full bg-cream-dark" />
        <div className="h-12 w-full bg-cream-dark" />
      </div>
    </div>
  );
}
