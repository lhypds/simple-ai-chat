import { getLangCodes } from "utils/langUtils";

export default async function lang(args) {
  const command = args[0];
  const langCodes = getLangCodes();

  if (command === "ls" || command === "list") {
    // Add star to current lang
    let result = "\\" + langCodes.join(" \\");
    if (localStorage.getItem("lang")) {
      const currentLang = localStorage.getItem("lang").replace(" force", "");
      result = result.replace("\\" + currentLang, "*\\" + currentLang);
    }
    return result;
  }
  
  if (command === "use") {
    if (args.length != 2) {
      return "Usage: :lang use [language code]";
    }

    if (langCodes.includes(args[1])) {
      localStorage.setItem("lang", args[1] + " force");
      return "Language set to " + args[1] + ".";
    } else {
      return "Language code not found.";
    }
  }

  return "Usage: :lang [ls|list]\n" +
         "       :lang use [language code]\n";
}
