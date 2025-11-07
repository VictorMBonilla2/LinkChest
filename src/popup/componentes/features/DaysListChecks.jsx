import React from 'react'
import Checkbox from '../UI/Checkbox'

export default function DaysListChecks({selectedDays= [], setSelectedDays}) {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const handleToggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  return (
    <div className="grid grid-cols-4 gap-2 mx-auto">
      {days.map((day) => (
        <Checkbox
          key={day}
          label={day}
          checked={selectedDays.includes(day)}
          onChange={() => handleToggleDay(day)}
        />
      ))}
    </div>
  );
}   