const AuthImagePattern = ({ title, subtitle }) => {
  // Cool crypto-style icons including ₹, ₿, etc.
  const icons = ["💼", "🎓", "🧠", "👨‍💻", "📚", "🚀", "🧑‍🏫", "📈", "🧭"];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {icons.map((icon, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-semibold ${
                i % 2 === 0 ? "bg-purple-600 text-white animate-pulse" : "bg-primary/10"
              }`}
            >
              {icon}
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-extrabold mb-2">{title}</h2>
        <p className="text-base-content/60 text-lg">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
