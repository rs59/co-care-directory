import Address from "./Address";

import { CareResult } from "../util";

// TODO: add hours, languages, services, map

export default function ResultDetail({ data }: { data: CareResult }) {
  return (
    <div>
      <h1>{data.name}</h1>
      <Address data={data} />
      {data.phone && <p>{data.phone}</p>}
    </div>
  );
}
