import { usePathname } from 'next/navigation';
import { NavigationTabs } from '~/components';

export function Navigator({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const pathname = usePathname();
  return (
    <NavigationTabs
      data={items}
      activeIndex={items.findIndex(
        item =>
          pathname.endsWith(item.href) || pathname.includes(`/${item.href}/`)
      )}
    />
  );
}
