"use client";

import React, { useState, ReactNode } from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  children: ReactNode;
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: ReactNode;
}

interface AccordionTriggerProps {
  className?: string;
  children: ReactNode;
}

interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

export function Accordion({ 
  type = "single", 
  collapsible = true, 
  className,
  children 
}: AccordionProps) {
  return (
    <div className={clsx("w-full", className)}>
      {children}
    </div>
  );
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={clsx("border-b border-gray-200 dark:border-gray-700", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === AccordionTrigger) {
            return React.cloneElement(child as React.ReactElement<any>, { 
              isOpen, 
              onToggle: handleToggle 
            });
          }
          if (child.type === AccordionContent) {
            return React.cloneElement(child as React.ReactElement<any>, { isOpen });
          }
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({ 
  className, 
  children,
  isOpen,
  onToggle
}: AccordionTriggerProps & { isOpen?: boolean; onToggle?: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline",
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
    >
      {children}
      <ChevronDown
        className={clsx(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

export function AccordionContent({ className, children, isOpen }: AccordionContentProps & { isOpen?: boolean }) {
  return (
    <div
      className={clsx(
        "overflow-hidden text-sm transition-all",
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className="pb-4 pt-0 text-gray-600 dark:text-gray-400">
        {children}
      </div>
    </div>
  );
}

