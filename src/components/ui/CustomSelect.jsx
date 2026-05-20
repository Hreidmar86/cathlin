import { useEffect, useId, useRef, useState } from "react";

export default function CustomSelect({ value, options, onChange, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(0, options.findIndex((option) => option.value === value)));
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const optionRefs = useRef([]);
  const listboxId = useId();

  const selectedOption = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
  }, [options, value]);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

  function commitSelection(nextValue) {
    onChange(nextValue);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleButtonKeyDown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      if (event.key === "ArrowUp") {
        setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value)));
      }
    }
  }

  function handleOptionKeyDown(event, index) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(options.length - 1, current + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(0, current - 1));
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commitSelection(options[index].value);
    }
  }

  return (
    <div ref={rootRef} className={`custom-select ${open ? "is-open" : ""}`}>
      <button
        ref={buttonRef}
        className="custom-select-trigger field"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleButtonKeyDown}
      >
        <span>{selectedOption?.label || ""}</span>
        <span className="custom-select-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {open ? (
        <div className="custom-select-menu" role="listbox" id={listboxId} aria-label={ariaLabel}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`custom-select-option ${isSelected ? "is-selected" : ""} ${isActive ? "is-active" : ""}`}
                onClick={() => commitSelection(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                <span>{option.label}</span>
                {isSelected ? (
                  <span className="custom-select-check" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
