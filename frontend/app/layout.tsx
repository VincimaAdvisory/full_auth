
import "@/styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Provider } from "@/redux/provider";
import { Footer, Navbar, NavbarMobile, Sidebar } from "@/components/common";
import { Setup } from "@/components/utils";
import { NextIntlClientProvider } from "next-intl";
// import { getMessages, getLocale } from "next-intl/server";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Full auth",
  description: "Full auth application that provides jwt authentication",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const locale = await getLocale();
  // const messages = await getMessages();
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value ?? routing.defaultLocale;
  const messages = (await import(`../messages/${locale}.json`)).default;

  // console.log(`locale:${locale}`);

  return (
    <html lang={locale} className={geist.className}>
      <body>
        <Provider>
          <Setup />
          <div className="flex">
            {/* <Sidebar /> */}
            <main className="flex-1">
              <NextIntlClientProvider locale={locale} messages={messages}>
                <Navbar />
                {/* <NavbarMobile /> */}
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-8">
                  {children}
                </div>
                <Footer />  
              </NextIntlClientProvider>
            </main>
          </div>
          {/* <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-8">{children}</div> */}
        </Provider>
      </body>
    </html>
  );
}
