<script>
  import { onMount } from "svelte";
  import {
    connect,
    chart,
    getAppFields,
    getMasterItems,
  } from "../function/qlik";
  import NebTable from "./NebTable.svelte";
  import NebBar from "./NebBar.svelte";

  let qStruc = {
    app: "",
    nebbie: "",
    allFields: "",
    masterMeasures: "",
  };

  onMount(async () => {
    qStruc.app = await connect();
    let [nebbie, allFields, masterMeasures] = await Promise.all([
      chart(qStruc.app),
      getAppFields(qStruc.app),
      getMasterItems(qStruc.app),
    ]);

    qStruc.nebbie = nebbie;
    qStruc.allFields = allFields;
    qStruc.masterMeasures = masterMeasures;
  });
</script>

<main>
  {#if qStruc.nebbie}
    <div class="container">
      <NebBar {qStruc} />
      <NebTable {qStruc} />
    </div>
  {/if}
</main>

<style>
  :global(:root) {
    --color-primary: #db0011;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
</style>
