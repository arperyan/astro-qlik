<script>
  import { onMount, tick } from "svelte";
  import { createObject } from "../function/qlik";

  export let qStruc;

  $: ({ nebbie, app } = qStruc);

  let element;
  let selectedDimension;
  let currentNebbie;
  let selectedMeasure = null;

  onMount(async () => {
    currentNebbie = await nebbie.render({
      element: element,
      type: "bar",
      fields: ["Name", "=sum(Weight)"],
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
  <div class="chart-object" bind:this={element} />
</div>

<style>
  .chart-container {
    height: 500px;
  }

  .chart-object {
    position: relative;
    height: 100%;
  }
</style>
