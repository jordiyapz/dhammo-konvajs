import {
  CittaID,
  cittaIdList,
  getCittaCombination,
} from "@/entities/citta/@x/cetasika";
import { CetasikaGroupTerms, CetasikaID } from "../model/interface";
import { cetasikaIdList } from "../model/repository";

export const cetasikaGroups = {
  sabbaSaddharana: [
    "phassa",
    "vedana",
    "sanna",
    "cetana",
    "ekaggata",
    "jivitindriya",
    "manasikara",
  ],
  pakinnaka: ["vitakka", "vicara", "adhimokha", "viriya", "piti", "chanda"],
  mohaCatukka: ["moha", "ahirika", "anottappa", "uddaccha"],
  lobhaTri: ["lobha", "ditthi", "mana"],
  dosaCatukka: ["dosa", "issa", "macchariya", "kukuccha"],
  thinamiddha: ["thina", "middha"],
  sobhanaSaddharana: [
    "saddha",
    "sati",
    "hiri",
    "ottappa",
    "alobha",
    "adosa",
    "tatramajjhattata",
    "cittapasadhi",
    "cittalahutta",
    "cittamudutta",
    "cittakammannata",
    "cittapagunnata",
    "cittujukata",
    "kayapasadhi",
    "kayalahutta",
    "kayamudutta",
    "kayakammannata",
    "kayapagunnata",
    "kayujukata",
  ],
  virati: ["sammavaca", "sammakammanta", "sammajiva"],
  appamanna: ["karuna", "mudita"],
} satisfies Record<CetasikaGroupTerms, CetasikaID[]>;

export const generateAssociationTable = () => {
  return cetasikaIdList.reduce((data, cetasikaId) => {
    const cittaList: CittaID[] = [];
    cittaIdList.forEach((cittaId) => {
      const combination = getCittaCombination(cittaId);
      if (!combination) return;
      if (
        combination.mustHave.includes(cetasikaId) ||
        combination.sometime.includes(cetasikaId)
      )
        cittaList.push(cittaId);
    });
    data[cetasikaId] = cittaList;
    return data;
  }, Object.fromEntries(cetasikaIdList.map((cetasikaId) => [cetasikaId, [] as CittaID[]])));
};
