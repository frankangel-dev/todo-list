import {forwardRef} from "react";

// autoComplete is off by default since task titles are never the same twice
const TextInputWithLabel = forwardRef(function TextInputWithLabel({
                                                                    elementId,
                                                                    labelText,
                                                                    value,
                                                                    onChange,
                                                                    placeholder,
                                                                    maxLength,
                                                                    autoComplete = 'off'
                                                                  }, ref) {
  return (
    <div className={'w-full flex-1'}>
      <label htmlFor={elementId} className={'sr-only'}>{labelText}</label>
      <input
        className={'min-h-12 w-full rounded-full border border-border bg-bg px-4 text-base text-text-primary outline-none placeholder:text-text-muted'}
        ref={ref}
        type={"text"}
        id={elementId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
      />
    </div>
  );
});

export default TextInputWithLabel;
