<script>
  import { onMount, tick } from "svelte";

  export let qStruc;

  $: ({ nebbie } = qStruc);

  let element;

  onMount(async () => {
    await nebbie.render({
      element: element,
      type: "scatterplot",
      fields: ["Name", "=avg(Weight)", "=avg(Horsepower)"],
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
