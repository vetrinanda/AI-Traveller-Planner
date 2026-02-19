import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export function Button({ className, variant = 'primary', size = 'default', asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';
  const base = 'btn';
  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    icon: 'btn-icon',
  };
  const sizes = {
    default: '',
    sm: 'text-sm py-2 px-4',
    lg: 'text-base py-4 px-8',
    full: 'w-full',
  };
  return (
    <Comp className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

export function Badge({ className, variant = 'violet', children, ...props }) {
  const variants = {
    violet: 'badge-violet',
    cyan: 'badge-cyan',
    amber: 'badge-amber',
  };
  return (
    <span className={cn('badge', variants[variant], className)} {...props}>
      {children}
    </span>
  );
}

export function Card({ className, glow = false, children, ...props }) {
  return (
    <div className={cn('card', glow && 'border-glow pulse-glow', className)} {...props}>
      {children}
    </div>
  );
}

export function Separator({ className, ...props }) {
  return <hr className={cn('divider', className)} {...props} />;
}

export function Input({ className, icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'rgba(139,92,246,0.7)' }}
        />
      )}
      <input className={cn('input-field', className)} {...props} />
    </div>
  );
}
