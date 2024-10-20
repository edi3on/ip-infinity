import { readFileSync, writeFileSync } from "fs";
//an idea not used 
export const setRoyalty = async function (ipaAddress: string, amount: number, adding: boolean){
    const royalitiesJson = readFileSync('scripts/database/royalties.json');
    const royalities = JSON.parse(royalitiesJson.toString());
    if (ipaAddress in royalities){
        if (adding){
            royalities[ipaAddress].unclaimed += amount;
        } else {
            royalities[ipaAddress].claimed += amount;
        }
    } else {
        const newRoyalty = {
            "ipa_address": ipaAddress as string,
            "claimed": 0,
            "unclaimed": 0,
        }
        if (adding){
            newRoyalty.unclaimed += amount;
        } else {
            newRoyalty.claimed += amount;
        }
        royalities.push(newRoyalty);
    }
    writeFileSync('scripts/database/royalties.json', JSON.stringify(royalities, null, 2));
}

