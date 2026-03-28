export default function Card({ item }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col active:scale-95 active:shadow-sm transition-all duration-150 cursor-pointer select-none"
    >
      <div className="relative overflow-hidden bg-purple-50" style={{ paddingBottom: "60%" }}>
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span className="absolute top-2 right-2 text-3xl drop-shadow">{item.emoji}</span>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <h2 className="text-base font-bold text-purple-800 leading-tight">{item.title}</h2>
        <p className="text-xs text-gray-500 leading-snug">{item.description}</p>
      </div>
    </a>
  );
}
