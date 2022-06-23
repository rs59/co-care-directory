import { DailyHours, WeeklyHours } from "../../types";

const formatDailyHours = (hours: DailyHours) => {
  return hours.open ? `${hours.start} - ${hours.end}` : "Closed";
};

function Hours({ hours }: { hours: WeeklyHours }) {
  return hours ? (
    <>
      <div className="margin-bottom-1">
        Monday: {formatDailyHours(hours.monday)}
      </div>
      <div className="margin-bottom-1">
        Tuesday: {formatDailyHours(hours.tuesday)}
      </div>
      <div className="margin-bottom-1">
        Wednesday: {formatDailyHours(hours.wednesday)}
      </div>
      <div className="margin-bottom-1">
        Thursday: {formatDailyHours(hours.thursday)}
      </div>
      <div className="margin-bottom-1">
        Friday: {formatDailyHours(hours.friday)}
      </div>
      <div className="margin-bottom-1">
        Saturday: {formatDailyHours(hours.saturday)}
      </div>
      <div className="margin-bottom-1">
        Sunday: {formatDailyHours(hours.sunday)}
      </div>
    </>
  ) : (
    <div className="margin-bottom-1">Please contact directly for hours</div>
  );
}

export default Hours;
