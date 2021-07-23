import table from "@nebula.js/sn-table";
import nebula from "@nebula.js/stardust";
import connect from "./connect";

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

// export const connect = async () => {
//   const session = connect({
//     schema,
//     url: `ws://localhost:4848/app/engineData`,
//     createSocket: (url) => new WebSocket(url),
//   });

//   const global = await session.open();
//   // @ts-ignore
//   return await global.openDoc("Cars.qvf");
// };

// Connect to Cloud
export const qlikConnect = async () => {
  const app = await connect({
    url: "https://oaw5nbmep0bhq2j.eu.qlikcloud.com",
    webIntegrationId: "B0HZmvmOt3kMjQaTF6OavG8QloKH3ktW",
    appId: "961d1d90-fe99-4035-86be-c6d58ee2efa8",
  });

  return app;
};

const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const chartTheme = () => {
  return {
    type: "light",
    color: getRandomColor(),
    backgroundColor: getRandomColor(),
    title: {
      main: {
        color: getRandomColor(),
        fontSize: "18px",
        fontFamily: "@font-family",
      },
      subTitle: {
        color: getRandomColor(),
        fontSize: "30px",
        fontFamily: "@font-family",
      },
      footer: {
        color: getRandomColor(),
        fontSize: "@TextSize",
        fontFamily: "@font-family",
        backgroundColor: getRandomColor(),
      },
    },
    axis: {
      title: {
        color: getRandomColor(),
        fontSize: "18px",
        fontFamily: "@font-family",
      },
      label: {
        name: {
          color: getRandomColor(),
          fontSize: "18px",
          fontFamily: "@font-family",
        },
      },
      line: {
        major: {
          color: getRandomColor(),
        },
        minor: {
          color: getRandomColor(),
        },
      },
    },
    legend: {
      title: {
        color: getRandomColor(),
        fontSize: "@TextSize",
        fontFamily: "@font-family",
      },
      label: {
        color: getRandomColor(),
        fontSize: "@TextSize",
        fontFamily: "@font-family",
      },
    },
    label: {
      value: {
        color: getRandomColor(),
        fontSize: "8px",
        fontFamily: "@font-family",
      },
    },
    outOfRange: {
      color: getRandomColor(),
    },
    dataColors: {
      primaryColor: getRandomColor(),
      othersColor: "#f8e08e",
      errorColor: "#CC4000",
      nullColor: "#ffffff",
    },
  };
};

export const chart = async (app) => {
  const module = await import("@nebula.js/sn-bar-chart");
  let bar = module.default;
  const module2 = await import("@nebula.js/sn-scatter-plot");
  let scatterplot = module2.default;

  const nebbie = nebula.embed(app, {
    themes: [
      {
        id: "custom",
        load: () => Promise.resolve(chartTheme()),
      },
    ],
    context: {
      theme: "custom",
      constraints: {
        active: false,
        passive: false,
        select: false,
      },
      language: "en-US",
    },
    types: [
      {
        name: "table",
        load: () => Promise.resolve(table),
      },
      {
        name: "bar",
        load: () => Promise.resolve(bar),
      },
      {
        name: "scatterplot",
        load: () => Promise.resolve(scatterplot),
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
