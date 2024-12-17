import fs from "fs";

const CONFIG_FILE_PATH = "./ws/GraphConfig.json";
const ELEMENT_TYPES = { nodes: "nodes", connections: "connections" };

const loadGraphConfiguration = async () => {
  if (!fs.existsSync(CONFIG_FILE_PATH)) {
    const baseSetup = {};
    Object.values(ELEMENT_TYPES).forEach((element) => (baseSetup[element] = {}));
    console.log(baseSetup);
    await fs.promises.writeFile(CONFIG_FILE_PATH, JSON.stringify(baseSetup), "utf8");
  }

  const graphConfig = await fs.promises.readFile(CONFIG_FILE_PATH, "utf8");
  return JSON.parse(graphConfig);
};

const editGraphConfiguration = async (type, id, content) => {
  const graphConfig = await loadGraphConfiguration();
  graphConfig[type][id] = content;
  await fs.promises.writeFile(CONFIG_FILE_PATH, JSON.stringify(graphConfig), "utf8");
};

const removeGraphConfiguration = async (type, id) => {
  const graphConfig = await loadGraphConfiguration();
  delete graphConfig[type][id];
  await fs.promises.writeFile(CONFIG_FILE_PATH, JSON.stringify(graphConfig), "utf8");
};

const resetGraphConfiguration = async () => {
  const baseSetup = {};
  Object.values(ELEMENT_TYPES).forEach((element) => (baseSetup[element] = {}));
  console.log(baseSetup);
  await fs.promises.writeFile(CONFIG_FILE_PATH, JSON.stringify(baseSetup), "utf8");
};

const GraphConfig = {
  ELEMENT_TYPES,
  loadGraphConfiguration,
  editGraphConfiguration,
  removeGraphConfiguration,
  resetGraphConfiguration,
};

export default GraphConfig;
