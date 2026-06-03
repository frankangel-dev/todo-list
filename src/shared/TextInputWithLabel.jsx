import {forwardRef} from "react";

const TextInputWithLabel = forwardRef(function TextInputWithLabel({elementId, labelText, value, onChange, placeholder, maxLength}, ref) {
    return (
        <div className={'bg-glass flex-1 items-center gap-3 rounded-full border border-border px-4 py-3 backdrop-blur-md'}>
            <label
                htmlFor={elementId} className={'sr-only'}>{labelText}</label>
            <input
                className={'w-full text-text-primary outline-none placeholder:text-text-muted'}
                ref={ref}
                type={"text"}
                id={elementId}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
            />
        </div>
    );
});

export default TextInputWithLabel;