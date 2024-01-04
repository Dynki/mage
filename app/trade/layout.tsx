

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}