<template>
<main>
  
    <div class="chart-container">
  <div class="chart-object"  ref="element"/>
</div>

</main>
</template>

<script>
  

export default {
  name: "NebTable",
  props: ["qStruc"],
  async mounted() {
    await this.qStruc.nebbie.render({
      element: this.$refs.element,
      type: "table",
      fields: ["Name", "=sum(Weight)"],
    });
  }
};
</script>


<style scoped>
    .chart-container {
    height: 500px;
  }

  .chart-object {
    position: relative;
    height: 100%;
  }

  
</style>