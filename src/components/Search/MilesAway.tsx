import { useTranslation } from "react-i18next";
import { METERS_IN_A_MILE } from "../../util";

export default function MilesAway({ meters }: { meters?: number }) {
  const { t } = useTranslation();
  const miles = meters ? (meters / METERS_IN_A_MILE).toFixed(1) : "??";
  return (
    <p className="text-base margin-top-0 margin-bottom-0">
      {t("components.milesAway", { miles })}
    </p>
  );
}