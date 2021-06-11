<script>
  import { onMount, tick } from "svelte";
  import { createObject } from "../function/qlik";

  import ZenSelect from "../UI/ZenSelect.svelte";

  export let qStruc;

  $: ({ nebbie, app, allFields, masterMeasures } = qStruc);

  let element;
  let selectedDimension;
  let currentNebbie;
  let selectedMeasure = null;

  onMount(async () => {
    currentNebbie = await nebbie.render({
      element: element,
      type: "table",
      // fields: ["Name", "=sum(Weight)"],
    });
  });

  const selectChange = async () => {
    await tick();
    console.log(selectedMeasure);
    await createObject(
      app,
      currentNebbie.id,
      selectedDimension,
      selectedMeasure
    );
    //await addMeasure(app, currentNebbie.id, selectedMeasure);
  };
</script>

<div class="chart-container">
  <div class="chart-select">
    <ZenSelect
      id="dimension"
      label="Dimension"
      --primary="#db0011"
      on:change={selectChange}
      bind:value={selectedDimension}
    >
      <option value="" selected disabled>Select Dimension</option>
      {#each allFields as { qName }}
        <option value={qName} selected={selectedDimension == qName}>
          {qName}
        </option>
      {/each}
    </ZenSelect>
    <ZenSelect
      id="measure"
      label="Measure"
      on:change={selectChange}
      --primary="var(--color-primary)"
      bind:value={selectedMeasure}
    >
      <option value="" selected disabled>Select Measure</option>
      {#each masterMeasures as data}
        <option value={data} selected={selectedMeasure == data}>
          {data.qMeta.title}
        </option>
      {/each}
    </ZenSelect>
  </div>
  <div class="chart-object" bind:this={element} />
</div>

<style>
  .chart-container {
    height: 500px;
  }

  .chart-select {
    display: flex;
    align-self: flex-start;
  }
  .chart-object {
    position: relative;
    height: 100%;
  }
</style>
