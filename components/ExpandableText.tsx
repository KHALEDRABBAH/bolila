'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

/**
 * ExpandableText — Shows truncated text with "Show More / Show Less" toggle.
 * Used whenever content might overload the page (messages, notes, descriptions).
 */
export default function ExpandableText({ text, maxLength = 150, className = '' }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;

  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <div className={className}>
      <span>
        {expanded ? text : `${text.slice(0, maxLength)}...`}
      </span>
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1 text-gold hover:text-gold/80 text-sm font-medium ms-2 transition-colors"
      >
        {expanded ? (
          <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
        ) : (
          <>Show More <ChevronDown className="w-3.5 h-3.5" /></>
        )}
      </button>
    </div>
  );
}
