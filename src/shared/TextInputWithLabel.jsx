export default function TextInputWithLabel({elementId, labelText, ref, value, onChange}) {
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
}