import { h } from "preact";
import React from "react";
import { useState, useEffect } from "preact/hooks";
import usePromise from "react-use-promise";

import {
  chart,
  getAppFields,
  getMasterItems,
  qlikConnect,
} from "../function/qlik";
// import NebBar from "./NebBar";
import NebTable from "./NebTable";

const useSessionObjects = (app) => {
  const [sessionApp] = usePromise(async () => {
    if (!app) return;
    const [nebbie, allFields, masterMeasures] = await Promise.all([
      chart(app),
      getAppFields(app),
      getMasterItems(app),
    ]);
    return {
      nebbie,
      allFields,
      masterMeasures,
    };
  }, [app]);
  return sessionApp;
};

const PreactApp = () => {
  const [app, setApp] = useState();

  const init = async () => {
    const connect = await qlikConnect();
    setApp(connect);
  };

  useEffect(() => {
    init();
  }, []);
  const objs = useSessionObjects(app);

  return (
    <div>
      {/* <NebBar qStruc={objs} />
      <NebTable qStruc={objs} /> */}
    </div>
  );
};

export default PreactApp;
