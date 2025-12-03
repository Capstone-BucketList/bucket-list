import { useState, useEffect } from "react";

interface TypewriterTextProps {
    text?: string;
    roles?: string[];
    speed?: number;
    pause?: number;
    style?: string;
}

const TypewriterText = ({ text = "", roles = [], speed = 120, pause = 1000, style = "" }: TypewriterTextProps) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(true);
    const [roleIndex, setRoleIndex] = useState(0);

    // Use roles if provided, otherwise use single text
    const currentText = roles.length > 0 ? roles[roleIndex] : text;

    useEffect(() => {
        if (!currentText) return;

        let timeout: number;
        const handleTyping = () => {
            if (!isDeleting) {
                if (displayedText.length < currentText.length) {
                    setDisplayedText(currentText.substring(0, displayedText.length + 1));
                    timeout = setTimeout(handleTyping, speed);
                } else {
                    timeout = setTimeout(() => setIsDeleting(true), pause);
                }
            } else {
                if (displayedText.length > 0) {
                    setDisplayedText("");
                    timeout = setTimeout(handleTyping, speed / 2);
                } else {
                    // Move to next role if using roles array
                    if (roles.length > 0) {
                        setRoleIndex((prev) => (prev + 1) % roles.length);
                    }
                    setIsDeleting(false);
                    timeout = setTimeout(handleTyping, speed);
                }
            }
        };

        timeout = setTimeout(handleTyping, speed);
        return () => clearTimeout(timeout);
    }, [displayedText, isDeleting, currentText, speed, pause, roles, roleIndex]);

    return (
        <h1 className={style}>
            {displayedText}
            <span className="animate-pulse">|</span>
        </h1>
    );
};

export default TypewriterText;
