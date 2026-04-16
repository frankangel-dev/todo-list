import {forwardRef} from "react";

const TextInputWithLabel = forwardRef(function TextInputWithLabel({elementId, labelText, value, onChange}, ref) {
    return (
        <>
            <label htmlFor={elementId}>{labelText}</label>
            <input
                ref={ref}
                type={"text"}
                id={elementId}
                value={value}
                onChange={onChange}
            />
        </>
    );
});

export default TextInputWithLabel;