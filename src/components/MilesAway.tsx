export default function MilesAway({ meters }: { meters?: number }) {
  const miles = meters ? (meters * 0.000621371192).toFixed(1) : '??';
  return (
    <p className="text-base margin-top-0 margin-bottom-0">
      {miles} miles away
    </p>
  );
}
