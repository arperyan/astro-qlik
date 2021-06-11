<script>
  export let id = undefined;
  export let label = undefined;
  export let value = undefined;
</script>

<div class="select-control">
  <label for={id}>{label}</label>
  <select {id} on:blur on:change bind:value>
    <slot />
  </select>
</div>

<style>
  select {
    display: block;
    width: 100%;
    font: inherit;
    border: none;
    border-bottom: 2px solid var(--primary);
    border-radius: 3px 3px 0 0;
    background: white;
    padding: 8px;
    transition: border-color 0.1s ease-out;
  }

  select:focus {
    border-color: var(--theme-primary);
    outline: none;
  }

  label {
    display: block;
    /* margin-bottom: 0.5rem; */
    width: 100%;
    font-size: 0.8rem;
  }

  .select-control {
    padding: 0.5rem 1rem;

    /* margin: 0.25rem 0; */
  }
</style>
