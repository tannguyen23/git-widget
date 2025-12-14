import { useState } from 'react';

interface ExpandableSectionProps {
    title: string;
    count: number;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, count, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mt-2">
            <button
                className="flex items-center justify-between w-full text-left text-xs font-bold text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-700/50 px-2 py-1 rounded transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <span className={`mr-1 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                        {/* Biểu tượng mũi tên (có thể dùng icon từ thư viện) */}
                        ▶
                    </span>
                    {title}
                </div>
                <span>({count})</span>
            </button>
            {isOpen && (
                <div className="mt-1 border-l-2 border-slate-700 ml-2">
                    {children}
                </div>
            )}
        </div>
    );
};

export default ExpandableSection;