import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

export type DropdownOption = {
  value: string;
  label: string;
  dotColor?: string; // optional small colored dot shown at the left of the option
};

interface DropdownProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: DropdownOption[];
  placeholder?: string;
  buttonClassName?: string;
  menuClassName?: string;
  isDark?: boolean;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  buttonClassName = '',
  menuClassName = '',
  isDark = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => options.find(o => o.value === value) || null, [options, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const colors = {
    bgButton: isDark ? 'rgba(31, 41, 55, 0.6)' : 'rgba(243, 244, 246, 0.9)',
    borderButton: isDark ? 'rgba(75, 85, 99, 0.4)' : 'rgba(226, 232, 240, 0.9)',
    text: isDark ? '#e5e7eb' : '#111827',
    textSecondary: isDark ? '#9ca3af' : '#6b7280',
    bgMenu: isDark ? 'rgba(17, 24, 39, 0.98)' : '#ffffff',
    borderMenu: isDark ? 'rgba(75, 85, 99, 0.6)' : 'rgba(226, 232, 240, 1)',
    optionHover: isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(243, 244, 246, 0.9)',
    check: isDark ? '#60a5fa' : '#3b82f6',
  };

  return (
    <div className="relative inline-block w-full">
      <button
        ref={buttonRef}
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-colors ${buttonClassName}`}
        style={{ background: colors.bgButton, borderColor: colors.borderButton, color: colors.text }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">
          {selected ? selected.label : <span style={{ color: colors.textSecondary }}>{placeholder}</span>}
        </span>
        <FiChevronDown className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className={`absolute z-50 mt-2 w-full overflow-hidden rounded-xl border shadow-xl ${menuClassName}`}
            style={{ background: colors.bgMenu, borderColor: colors.borderMenu }}
            role="listbox"
          >
            <div className="max-h-64 overflow-auto py-1">
              {options.map(opt => (
                <button
                  key={opt.value}
                  role="option"
                  aria-selected={value === opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
                  style={{ color: colors.text }}
                >
                  {opt.dotColor && (
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: opt.dotColor }}
                    ></span>
                  )}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {value === opt.value && <FiCheck className="h-4 w-4" style={{ color: colors.check }} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;