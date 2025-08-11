import { useLocale } from "next-intl";
import { Icon } from "~/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu";
import { LANGUAGES } from "~/i18n/locales/constsnts";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import * as Flags from "country-flag-icons/react/1x1";

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const handleLanguageChange = (newLocale: string) => {
    console.log("newLocale", newLocale);
    // 构造新的路径来切换语言
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Icon
            name="sphere"
            size={32}
            className="text-foreground pointer-events-none"
          />
          <Icon
            name="arrow"
            size={20}
            className="text-foreground/50 pointer-events-none"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={cn(
              "flex items-center gap-2",
              locale === language.code ? "text-foreground" : "",
            )}
          >
            {(() => {
              const Flag = Flags[language.flag as keyof typeof Flags];
              return Flag ? (
                <Flag
                  title={language.name}
                  className="shadow"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 16,
                    objectFit: "cover",
                  }}
                />
              ) : null;
            })()}
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
