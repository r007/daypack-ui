import * as React from 'react';
import { Icon, type IconProps } from './Icon';

export interface CreateIconOptions {
  viewBox?: string;
  fill?: string;
}

/** Build a named icon component from SVG children. */
export function createIcon(
  name: string,
  children: React.ReactNode,
  { viewBox = '0 0 32 32', fill }: CreateIconOptions = {},
) {
  const Component = React.forwardRef<SVGSVGElement, Omit<IconProps, 'children'>>(
    function NamedIcon(props, ref) {
      return (
        <Icon ref={ref} viewBox={viewBox} fill={fill} {...props}>
          {children}
        </Icon>
      );
    },
  );
  Component.displayName = `${name}Icon`;
  return Component;
}
