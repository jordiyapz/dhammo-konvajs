import cittaJson from "@/assets/citta.json";
import cittaLayout from "@/assets/citta-layout.json";

export const cittaMap = new Map(cittaJson.map((citta) => [citta.id, citta]));

export const getCittaById = (id: string) => cittaMap.get(id);

export const cittaIds = Array.from(cittaMap.keys());

export const cittaLayoutMap = new Map(
  cittaLayout.map((citta) => [citta.id, citta])
);

export function* cittaLayoutGroupGenerator() {
  const maxGroup = Math.max(...cittaLayout.map((citta) => citta.group));
  for (let i = 1; i <= maxGroup; i++) {
    const group = cittaLayout.filter((citta) => citta.group === i);
    yield function* () {
      for (const citta of group) {
        yield citta;
      }
    };
  }
}

const maxGroup = Math.max(...cittaLayout.map((citta) => citta.group));

export const cittaLayoutGroups = Array.from({ length: maxGroup }, (_, i) =>
  cittaLayout.filter((citta) => citta.group === i + 1)
);
