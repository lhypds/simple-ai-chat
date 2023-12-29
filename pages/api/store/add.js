import { getStore, insertStore } from "utils/sqliteUtils.js";
import { authenticate } from "utils/authUtils.js";

export default async function (req, res) {
  // Check if the method is POST
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, engine } = req.body;

  // Authentication
  const authResult = authenticate(req);
  if (!authResult.success) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication failed.',
      error: authResult.error
    });
  }
  const { id, username } = authResult.user;

  // Check store existance
  const sameNameStore = await getStore(name, username);
  if (sameNameStore) {
    return res.status(400).json({ 
      success: false, 
      error: "Store already exists." 
    });
  }

  let settings = {};
  if (engine === "mysql") {
    settings = {
      host: "",
      port: 3306,
      user: "",
      password: "",
      database: "",
      table: "",
      schema: "",
      tableColumnsDef: "",
      description: "",
    }
  }

  if (engine === "vectara") {
    settings = {
      apiKey: "",
      customerId: "",
      clientId: "",
      clientSecret: "",
      corpusId: "",
      description: "",
    }
  }

  insertStore(name, engine, JSON.stringify(settings), username);
  
  return res.status(200).json({ 
    success: true,
    message: "Store \"" + name + "\" is created. You can use command `:store \"" + name + "\"` to check store status and settings, and use `:store init [engine]` to initialize the store. Store `" + name + "` is now active.",
  });
}
