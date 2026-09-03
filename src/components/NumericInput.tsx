import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface NumericInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | undefined | null;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number | string;
  allowDecimals?: boolean;
  showSteppers?: boolean;
  autoSelectOnFocus?: boolean;
}

/**
 * Robust NumericInput component solving the React controlled input issues:
 * 1. Does not snap to 0 or min when backspacing/clearing.
 * 2. Allows fluid typing without stripping trailing decimals (e.g. "12.").
 * 3. Supports keyboard up/down arrow stepping and optional mini steppers.
 * 4. Normalizes to valid bounds on blur.
 * 5. Auto-selects on focus for effortless replacement.
 */
export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  allowDecimals = true,
  showSteppers = false,
  autoSelectOnFocus = true,
  className = '',
  onFocus,
  onBlur,
  onKeyDown,
  ...rest
}) => {
  const [localVal, setLocalVal] = useState<string>(
    value !== undefined && value !== null ? String(value) : ''
  );
  const isFocusedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync from external changes when value changes outside user typing
  useEffect(() => {
    if (value === undefined || value === null) {
      if (!isFocusedRef.current) {
        setLocalVal('');
      }
      return;
    }

    const currentNum = parseFloat(localVal);
    // When focused, do not overwrite if user is in intermediate typing states
    if (isFocusedRef.current) {
      // Empty input while typing
      if (localVal === '' && (value === 0 || value === min)) {
        return;
      }
      // Floating decimal point (e.g. "15." or "0.")
      if (localVal.endsWith('.') || localVal === '-') {
        return;
      }
      // Number matches current parsed value
      if (!isNaN(currentNum) && currentNum === value) {
        return;
      }
    }

    setLocalVal(String(value));
  }, [value, min]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const allowNegative = min !== undefined ? min < 0 : false;

    // Filter invalid characters
    let sanitized = allowDecimals
      ? (allowNegative ? raw.replace(/[^0-9.-]/g, '') : raw.replace(/[^0-9.]/g, ''))
      : (allowNegative ? raw.replace(/[^0-9-]/g, '') : raw.replace(/[^0-9]/g, ''));

    // Prevent multiple dots
    const parts = sanitized.split('.');
    const cleanVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;

    setLocalVal(cleanVal);

    if (cleanVal === '' || cleanVal === '-' || cleanVal === '.' || cleanVal === '-.') {
      onChange(min ?? 0);
      return;
    }

    const parsed = parseFloat(cleanVal);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = false;

    if (localVal === '' || isNaN(parseFloat(localVal))) {
      const fallback = min !== undefined ? min : 0;
      setLocalVal(String(fallback));
      onChange(fallback);
    } else {
      let parsed = parseFloat(localVal);
      if (min !== undefined && parsed < min) parsed = min;
      if (max !== undefined && parsed > max) parsed = max;
      const formatted = Math.round(parsed * 100) / 100;
      setLocalVal(String(formatted));
      onChange(formatted);
    }

    if (onBlur) {
      onBlur(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    if (autoSelectOnFocus) {
      // Delay slightly to prevent browser deselecting
      setTimeout(() => {
        inputRef.current?.select();
      }, 20);
    }
    if (onFocus) {
      onFocus(e);
    }
  };

  const doStep = (direction: 'up' | 'down') => {
    const numStep = typeof step === 'number' ? step : parseFloat(step) || 1;
    const current = parseFloat(localVal) || (min ?? 0);
    let next = direction === 'up' ? current + numStep : current - numStep;

    if (min !== undefined && next < min) next = min;
    if (max !== undefined && next > max) next = max;

    const rounded = Math.round(next * 100) / 100;
    setLocalVal(String(rounded));
    onChange(rounded);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      doStep('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      doStep('down');
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="relative inline-flex items-center w-full">
      <input
        ref={inputRef}
        type="text"
        inputMode={allowDecimals ? 'decimal' : 'numeric'}
        value={localVal}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} ${showSteppers ? 'pr-5' : ''}`}
        {...rest}
      />
      {showSteppers && (
        <div className="absolute right-0 inset-y-0 flex flex-col justify-center border-l border-[#D1D1CD] bg-[#F4F4F1] w-4 select-none">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => doStep('up')}
            className="flex-1 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer text-[#8A8A85]"
            title="增加"
          >
            <ChevronUp className="w-2.5 h-2.5" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => doStep('down')}
            className="flex-1 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer text-[#8A8A85] border-t border-[#D1D1CD]"
            title="減少"
          >
            <ChevronDown className="w-2.5 h-2.5" />
          </button>
        </div>
      )}
    </div>
  );
};

