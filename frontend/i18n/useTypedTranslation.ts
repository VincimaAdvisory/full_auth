import { useTranslations } from "next-intl";
import { Messages } from "@/i18n-types";

export function useTypedTranslation<Namespace extends keyof Messages>(namespace: Namespace) {
    return useTranslations(namespace);
}