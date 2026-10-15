import NavBar from "@/components/public/NavBar";
import SiteFooter from "@/components/public/site-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-slot="public-layout" className="flex min-h-dvh flex-col">
      <a
        href="#contenido-publico"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <NavBar />
      <main
        id="contenido-publico"
        data-slot="public-main"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
