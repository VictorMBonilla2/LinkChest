export default function HeaderSlots({ left, center, right }) {
  return (
    <div className="header w-full h-16 flex w4 justify-between items-center px-4 pb-2  text-white">
      
      {/* Izquierda */}
      <div className="flex items-center flex-1 ">
        {left || null}
      </div>

      {/* Centro */}
      <div className="flex items-center min-w-[250px] justify-center flex-1">
        {center || null}
      </div>

      {/* Derecha */}
      <div className="flex items-center justify-end flex-1 gap-3">
        {right || null}
      </div>
    </div>
  );
}
