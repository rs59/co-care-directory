import { useTranslation } from "react-i18next";
import { DailyHours, WeeklyHours } from "../../types";

const formatDailyHours = (hours: DailyHours) => {
  return hours.open ? `${hours.start} - ${hours.end}` : "Closed";
};

const T_PREFIX = "components.resultDetail.";

function Hours({ hours }: { hours: WeeklyHours }) {
  const { t } = useTranslation();
  if (!hours) {
    return (
      <div className="margin-bottom-1">{t(`${T_PREFIX}contactForHours`)}</div>
    );
  }
  return (
    <>
      <div className="margin-bottom-1">
        {t(`${T_PREFIX}monday`)} {": "} {formatDailyHours(hours.monday)}
      </div>
      <div className="margin-bottom-1">
        {t(`${T_PREFIX}tuesday`)}: {formatDailyHours(hours.tuesday)}
      </div>
      <div className="margin-bottom-1">
        {t(`${T_PREFIX}wednesday`)}: {formatDailyHours(hours.wednesday)}
      </div>
      <div className="margin-bottom-1">
        {t(`${T_PREFIX}thursday`)}: {formatDailyHours(hours.thursday)}
      </div>
      <div className="margin-bottom-1">
        {t(`${T_PREFIX}friday`)}: {formatDailyHours(hours.friday)}
      </div>
      <div className="margin-bottom-1">
        {t(`${T_PREFIX}saturday`)}: {formatDailyHours(hours.saturday)}
      </div>
      <div className="margin-bottom-1">
        {t(`${T_PREFIX}sunday`)}: {formatDailyHours(hours.sunday)}
      </div>
    </>
  );
}

export default Hours;
