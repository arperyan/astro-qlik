<script>
  import { onMount, tick } from "svelte";
  import { createObject } from "../function/qlik";

  export let qStruc;

  $: ({ nebbie } = qStruc);

  let element;

  onMount(async () => {
    await nebbie.render({
      element: element,
      type: "bar",
      fields: ["Name", "=sum(Weight)"],
    });
  });
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
