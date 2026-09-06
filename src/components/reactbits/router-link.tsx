"use client";

/**
 * Adapter so React Bits components written for react-router-dom work with
 * this app's TanStack Router without changing their internals.
 */
import { Link as TanstackLink } from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  children?: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, children, ...rest },
  ref,
) {
  const Any = TanstackLink as unknown as React.ComponentType<Record<string, unknown>>;
  return (
    <Any to={to} ref={ref} {...rest}>
      {children}
    </Any>
  );
});
