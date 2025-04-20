import { CittaCombination, CittaID } from "../model/interface";
import { getCittaById } from "../model/repository";

import { cetasikaGroups } from "@/entities/cetasika/@x/citta";

const cittaGroups = {
  lobhamula: [
    "lobha1",
    "lobha2",
    "lobha3",
    "lobha4",
    "lobha5",
    "lobha6",
    "lobha7",
    "lobha8",
  ],
  pancavinnana: [
    "cakkhu1",
    "sota1",
    "ghana1",
    "jivha1",
    "kaya1",
    "cakkhu2",
    "sota2",
    "ghana2",
    "jivha2",
    "kaya2",
  ],
  mahakusala: [
    "mkus1",
    "mkus2",
    "mkus3",
    "mkus4",
    "mkus5",
    "mkus6",
    "mkus7",
    "mkus8",
  ],
  mahavipaka: [
    "mvip1",
    "mvip2",
    "mvip3",
    "mvip4",
    "mvip5",
    "mvip6",
    "mvip7",
    "mvip8",
  ],
  mahakiriya: [
    "mkir1",
    "mkir2",
    "mkir3",
    "mkir4",
    "mkir5",
    "mkir6",
    "mkir7",
    "mkir8",
  ],
  nanasampayutta: [
    "mkus1",
    "mkus2",
    "mkus5",
    "mkus6",
    "mvip1",
    "mvip2",
    "mvip5",
    "mvip6",
    "mkir1",
    "mkir2",
    "mkir5",
    "mkir6",
  ],
} satisfies Record<string, CittaID[]>;

function isIn<T extends string>(list: T[], cittaId: T) {
  return list.includes(cittaId);
}

export function calculateCittaCombination(cittaId: CittaID): CittaCombination {
  const citta = getCittaById(cittaId);
  if (!citta) throw new Error(`Citta ${cittaId} not found`);

  const association: CittaCombination = {
    mustHave: [...cetasikaGroups["sabbaSaddharana"]],
    sometime: [],
    variations: [[]],
    vedana: citta.vedana,
  };

  // Handle dvipancavinnana
  if (isIn(cittaGroups.pancavinnana, cittaId)) return association;

  // Handle ahetuka
  if (isIn<CittaID>(["pancadv", "sam1", "sam2", "san1", "san3"], cittaId)) {
    association.mustHave.push("vitakka", "vicara", "adhimokha");
    return association;
  }
  switch (cittaId) {
    case "has":
      association.mustHave.push(
        "vitakka",
        "vicara",
        "adhimokha",
        "viriya",
        "piti"
      );
      return association;
    case "manodv":
      association.mustHave.push("vitakka", "vicara", "adhimokha", "viriya");
      return association;
    case "san2":
      association.mustHave.push("vitakka", "vicara", "adhimokha", "piti");
      return association;
  }

  // Akusala lobhamula
  if (isIn(cittaGroups.lobhamula, cittaId)) {
    association.mustHave.push(...cetasikaGroups["mohaCatukka"], "lobha");
    // ditthisampayutta
    if (["lobha1", "lobha2", "lobha5", "lobha6"].includes(cittaId)) {
      association.mustHave.push("ditthi");
    } else {
      association.sometime.push("mana");
    }

    // somanasssa sahagata
    if (["lobha1", "lobha2", "lobha3", "lobha4"].includes(cittaId)) {
      association.mustHave.push(...cetasikaGroups["pakinnaka"]);
    } else {
      association.mustHave.push(
        "vitakka",
        "vicara",
        "adhimokha",
        "viriya",
        "chanda"
      );
    }

    if (isIn(["lobha2", "lobha4", "lobha6", "lobha8"], cittaId)) {
      association.sometime.push("thina", "middha");
    }

    return association;
  }

  /** Akusala dosamula */
  if (isIn(["dosa1", "dosa2"], cittaId)) {
    association.mustHave.push(...cetasikaGroups["mohaCatukka"], "dosa");
    association.mustHave.push(
      "vitakka",
      "vicara",
      "adhimokha",
      "viriya",
      "chanda"
    );

    association.sometime.push("issa", "macchariya", "kukuccha");
    if (cittaId === "dosa2") association.sometime.push("thina", "middha");
    return association;
  }

  /** Akusala dosamula */
  if (isIn<CittaID>(["moha2", "moha1"], cittaId)) {
    association.mustHave.push(...cetasikaGroups["mohaCatukka"]);
    association.mustHave.push("vitakka", "vicara", "viriya");
    if (cittaId === "moha1") association.mustHave.push("vicikiccha");
    else association.mustHave.push("adhimokha");
    return association;
  }

  /** Sobhana */
  association.mustHave.push(...cetasikaGroups["sobhanaSaddharana"]);

  // Kamasobhana
  if (
    isIn(
      [
        ...cittaGroups.mahakusala,
        ...cittaGroups.mahavipaka,
        ...cittaGroups.mahakiriya,
      ],
      cittaId
    )
  ) {
    if (isIn(cittaGroups.nanasampayutta, cittaId))
      association.mustHave.push("panna");
    association.mustHave.push(
      "vitakka",
      "vicara",
      "adhimokha",
      "viriya",
      "chanda"
    );
    if (association.vedana === "somanassa") association.mustHave.push("piti");
    if (isIn(cittaGroups.mahakiriya, cittaId)) {
      association.sometime.push(...cetasikaGroups.appamanna);
    }
    if (isIn(cittaGroups.mahakusala, cittaId)) {
      association.sometime.push(...cetasikaGroups.appamanna);
      association.sometime.push(...cetasikaGroups.virati);
    }
    return association;
  }

  // Mahaggata
  association.mustHave.push("panna", "adhimokha", "viriya", "chanda");
  const rupavacaraMatch = cittaId.match(/^r(kus|vip|kir)(\d)/)!;
  if (rupavacaraMatch) {
    const [_id, _jati, _jhana] = rupavacaraMatch;
    const jhana = parseInt(_jhana);
    switch (jhana) {
      case 1:
        association.mustHave.push("vitakka", "vicara", "piti");
        break;
      case 2:
        association.mustHave.push("vicara", "piti");
        break;
      case 3:
        association.mustHave.push("piti");
        break;
    }
    if (jhana !== 5) {
      association.sometime.push(...cetasikaGroups.appamanna);
    }
  }

  // Lokuttara
  const lokuttaraMatch = cittaId.match(/^(sot|sak|ana|ara)(mg|ph)(\d)/)!;
  if (lokuttaraMatch) {
    const [_id, _level, _variant, _jhana] = lokuttaraMatch;
    const jhana = parseInt(_jhana);
    switch (jhana) {
      case 1:
        association.mustHave.push("vitakka", "vicara", "piti");
        break;
      case 2:
        association.mustHave.push("vicara", "piti");
        break;
      case 3:
        association.mustHave.push("piti");
        break;
    }

    association.mustHave.push(...cetasikaGroups.virati);
  }

  return association;
}
