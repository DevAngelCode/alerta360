import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Alerta360",
  description: "Anticipamos riesgos. Impulsamos resultados.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
