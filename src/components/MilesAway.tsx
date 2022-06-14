export default function MilesAway({ meters }: { meters: number }) {
  const miles = meters * 0.000621371192;
  return (
    <p className="text-base margin-top-0 margin-bottom-0">
      {miles.toFixed(1)} miles away
    </p>
  );
}
