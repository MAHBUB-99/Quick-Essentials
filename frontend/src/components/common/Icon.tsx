import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { ICONS, type IconName } from '@/lib/icons';
import { cn } from '@/utils/cn';

export interface IconProps extends Omit<FontAwesomeIconProps, 'icon'> {
  name: IconName;
}

/**
 * Thin wrapper over FontAwesomeIcon that resolves a semantic icon name from our
 * curated registry. Using this everywhere keeps icon usage type-safe and makes
 * a future icon-library swap a one-file change.
 */
export function Icon({ name, className, ...props }: IconProps) {
  return <FontAwesomeIcon icon={ICONS[name]} className={cn(className)} {...props} />;
}
