export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-purple-400/30 bg-purple-500/20 text-purple-400 shadow-sm focus:ring-purple-400/50 focus:ring-2 ' +
                className
            }
        />
    );
}
