import { useTranslation } from "react-i18next";

export default function MilesAway({ meters }: { meters?: number }) {
  const { t } = useTranslation();
  const miles = meters ? (meters * 0.000621371192).toFixed(1) : '??';
  return (
    <p className="text-base margin-top-0 margin-bottom-0">
      {t('components.miles-away', { miles })}
    </p>
  );
}
