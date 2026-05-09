const trustItems = [
  "Free Shipping Pan-India",
  "1 Year Warranty",
  "100% Secure Checkout",
  "Handcrafted in India",
  "Hassle-Free Returns",
  "Easy Installation",
];

const TrustBar = () => {
  return (
    <div className="bg-primary py-4 overflow-hidden border-y border-black">
      <div className="flex whitespace-nowrap gap-8 sm:gap-12 animate-scroll">
        {[...trustItems, ...trustItems].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 sm:gap-4 text-black font-black text-sm sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em]"
          >
            <span>{item}</span>
            <div className="w-1.5 h-1.5 bg-black rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;
