<script>
  let children;
  let count = 0;
  function add() {
    count += 1;
  }
  function subtract() {
    count -= 1;
  }
</script>

<div class="counter">
  <button on:click={subtract}>-</button>
  <pre>{ count }</pre>
  <button on:click={add}>+</button>
</div>
<div class="children">
  <slot />
</div>

<style>
  button {
    border: 0 none;
    border-radius: 0.4rem;
    background: MediumAquamarine;
    color: white;
    cursor: pointer;
    line-height: 1;
    margin: 2rem 1rem 0 0;
    padding: 0.8rem 1.4rem;
    transition: background-color 0.3s ease;
  }
  button:hover,
  button:active {
    background: BlueViolet;
  }
</style>
