import schema from "enigma.js/schemas/12.67.2.json";
import enigma from "enigma.js";
import table from "@nebula.js/sn-table";
import nebula from "@nebula.js/stardust";
// const module = import("@nebula.js/sn-bar-chart");
// const bar = module.default;
//import bar from "@nebula.js/sn-bar-chart";
// console.log(bar);
const generateId = () => {
  const chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  const value = [];
  for (let i = 0; i < 6; i++) {
    let rnd = Math.floor(Math.random() * 62);
    value.push(chars[rnd]);
  }
  return value.join("");
};

export const connect = async () => {
  const session = enigma.create({
    schema,
    url: `ws://localhost:4848/app/engineData`,
    createSocket: (url) => new WebSocket(url),
  });

  const global = await session.open();
  // @ts-ignore
  return await global.openDoc("Cars.qvf");
};

export const chart = async (app) => {
  const module = await import("@nebula.js/sn-bar-chart");
  let bar = module.default;

  const nebbie = nebula.embed(app, {
    context: { theme: "light" },
    types: [
      {
        name: "table",
        load: () => Promise.resolve(table),
      },
      {
        name: "bar",
        load: () => Promise.resolve(bar),
      },
    ],
  });
  return nebbie;
};

export const getAppFields = async function (qDoc) {
  let props = {
    qInfo: {
      qId: "",
      qType: "FieldList",
    },
    qFieldListDef: {
      qShowSystem: true,
      qShowHidden: false,
      qShowSemantic: true,
      qShowSrcTables: true,
    },
  };
  let obj = await qDoc.createSessionObject(props);
  let objLayout = await obj.getLayout();
  qDoc.destroyObject(obj.id);
  return objLayout.qFieldList.qItems;
};

export const createObject = async (app, id, dimension, measure) => {
  let qObj = await app.getObject(id);
  let props = await qObj.getProperties();

  props.qHyperCubeDef.qDimensions[0] = {
    qDef: {
      cId: generateId(),
      qFieldDefs: [dimension],
      qSortCriterias: [{ qSortByAscii: -1 }],
    },
    qOtherTotalSpec: {
      qOtherMode: "OTHER_COUNTED",
      qOtherCounted: {
        qv: "10",
      },
      qOtherLimit: {
        qv: "0",
      },
      qOtherLimitMode: "OTHER_GE_LIMIT",
      qSuppressOther: true,
      qOtherSortMode: "OTHER_SORT_DESCENDING",
    },
    qOtherLabel: {
      qv: "Others",
    },
  };

  if (measure?.qInfo.qId) {
    props.qHyperCubeDef.qMeasures[0] = {
      qLibraryId: measure.qInfo.qId,
      qDef: {
        cId: generateId(),
      },
      qSortBy: {
        qSortByNumeric: -1,
      },
    };

    props.qHyperCubeDef.qInterColumnSortOrder = [1, 0];
  }

  await qObj.setProperties(props);

  return await qObj.getProperties();
};

export const getMasterItems = async (qDoc) => {
  let sessionObject = await qDoc.createSessionObject({
    qInfo: {
      qType: "MeasureList",
    },
    qMeasureListDef: {
      qType: "measure",
      qData: {
        title: "/title",
        tags: "/tags",
      },
    },
  });

  let sessionObjectLayout = await sessionObject.getLayout();
  await qDoc.destroySessionObject(sessionObject.id);
  return sessionObjectLayout.qMeasureList.qItems;
};

export default {
  connect,
  getAppFields,
  createObject,
  chart,
  getMasterItems,
};
