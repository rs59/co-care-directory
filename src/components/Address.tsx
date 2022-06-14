import { CareEntity } from "../util";

export default function Address({ data }: { data: CareEntity }) {
  const commaSeparatedPieces = [data.address, data.city, data.state].filter(
    (item) => !!item
  );
  let cleanedAddr = "";
  if (commaSeparatedPieces && data.zip) {
    cleanedAddr = `${commaSeparatedPieces.join(", ")} ${data.zip}`;
  } else if (commaSeparatedPieces.length) {
    cleanedAddr = commaSeparatedPieces.join(", ");
  }

  return (
    <p className="margin-top-0 margin-bottom-0">
      {cleanedAddr || "Address not available"}
    </p>
  );
}
