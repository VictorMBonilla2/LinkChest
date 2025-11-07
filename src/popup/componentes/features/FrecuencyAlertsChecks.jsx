import React from 'react'
import Checkbox from '../UI/Checkbox';

export default function FrecuencyAlertsChecks({ selected, setSelected }) {
  const options = [
    { label: "Baja", tooltip: "De vez en cuando" },
    { label: "Normal", tooltip: "Cada pocos dias" },
    { label: "Alta", tooltip: "Muy seguido; por lo menos uan vez al dia." },
  ];

  const handleSelect = (option) => {
    setSelected((prev) => (prev.toLowerCase() === option.toLowerCase()  ? "" : option.toLowerCase()   ));
  };

  return (
    <div className="grid grid-cols-3 gap-2 mx-auto">
      {options.map((opt) => (
        <Checkbox
          key={opt.label}
          label={opt.label}
          checked={selected === opt.label.toLowerCase() }
          onChange={() => handleSelect(opt.label)}
          tooltip={opt.tooltip} // 👈 Tooltip personalizado
        />
      ))}
    </div>
  );
}
