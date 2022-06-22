import { HoursOfOperation } from "../../types";

type HoursProps = {
  hours: {
    sunday: HoursOfOperation;
    monday: HoursOfOperation;
    tuesday: HoursOfOperation;
    wednesday: HoursOfOperation;
    thursday: HoursOfOperation;
    friday: HoursOfOperation;
    saturday: HoursOfOperation;
  }
}

function Hours({ hours }: HoursProps) {
  return (
    <>
      <div className="margin-bottom-1">Monday: {hours.monday ? `${hours.monday.start} - ${hours.monday.end}`: 'Closed'}</div>
      <div className="margin-bottom-1">Tuesday: {hours.tuesday ? `${hours.tuesday.start} - ${hours.tuesday.end}`: 'Closed'}</div>
      <div className="margin-bottom-1">Wednesday: {hours.wednesday ? `${hours.wednesday.start} - ${hours.wednesday.end}`: 'Closed'}</div>
      <div className="margin-bottom-1">Thursday: {hours.thursday ? `${hours.thursday.start} - ${hours.thursday.end}`: 'Closed'}</div>
      <div className="margin-bottom-1">Friday: {hours.friday ? `${hours.friday.start} - ${hours.friday.end}`: 'Closed'}</div>
      <div className="margin-bottom-1">Saturday: {hours.saturday ? `${hours.saturday.start} - ${hours.saturday.end}`: 'Closed'}</div>
      <div className="margin-bottom-1">Sunday: {hours.sunday ? `${hours.sunday.start} - ${hours.sunday.end}`: 'Closed'}</div>
    </>
  )
}

export default Hours;