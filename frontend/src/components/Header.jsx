function Header() {
  return (
    <div className="flex flex-col items-center mb-10">
      <h1 className="heading-font text-6xl font-semibold tracking-[-0.04em] bg-linear-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.08)]">
        PrepWise AI
      </h1>

      <p className="heading-font text-zinc-400 mt-3 text-center text-lg">
        AI-powered voice interview simulator for modern developers
      </p>
    </div>
  );
}

export default Header;
