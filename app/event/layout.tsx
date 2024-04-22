export default function EventLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen justify-between pt-[9vh] max-w-[960px] ml-auto mr-auto">
      {children}
    </main>
  );
}
