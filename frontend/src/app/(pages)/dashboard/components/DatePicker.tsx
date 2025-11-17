import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './DatePicker.css';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  today?: string;
  onClose?: () => void;
}

export function DatePicker({ selectedDate, onDateChange, today, onClose }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      onDateChange(dateStr);
      setIsOpen(false);
      onClose?.();
    }
  };

  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
        title="Select date"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {selectedDate && today && selectedDate !== today ? (
          <span>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        ) : (
          <span>Date</span>
        )}
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <div className="bg-black/95 border border-white/20 rounded-lg p-4 shadow-xl">
            <DayPicker
              mode="single"
              selected={selectedDateObj}
              onSelect={handleDateSelect}
              className="text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}

