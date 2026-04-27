import { useState } from "react";

const PREVIEW_LINES = 4;

export default function Description({ description }) {
    const [expanded, setExpanded] = useState(false);

    const lines = description
        .replace(/<br\s*\/?>/gi, '\n')
        .split('\n')
        .filter(line => line.trim() !== '');

    const visible = expanded ? lines : lines.slice(0, PREVIEW_LINES);

    return (
        <div className="desc-wrapper">
            {visible.map((line, i) => (
                <p key={i} className={line.startsWith('*') ? 'desc-bullet' : 'desc-text'}>
                    {line.startsWith('*') ? line.slice(1).trim() : line}
                </p>
            ))}

            {lines.length > PREVIEW_LINES && (
                <button className="read-more-btn" onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Show less ↑' : 'Read more ↓'}
                </button>
            )}
        </div>
    );
}