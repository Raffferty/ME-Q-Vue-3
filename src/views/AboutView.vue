<template>
  <div class="container">
    <div class="about">
      <div class="grid">
        <div class="card col-6">
          <div class="card-header">
            <h2>This is an about page</h2>
          </div>
          <p class="test-var">Test var</p>
        </div>
    
        <div class="card primary col-6">
          <h1>This is an about page</h1>
          <p class="test-var">Test var</p>
        </div>
    
        <div class="card primary col-6">
          <h1>This is an about page</h1>
          <p class="test-var">Test var</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .about {
    $test-var-color: yellow;
    font-family: Outfit;

    h1 {
      color: var(--color-primary);

      @include text-overflow;
    }

    .test-var {
      width: fit-content;
      padding: 4px;
      color: var(--color-secondary);

      font-family: RedHatDisplay;

      &:hover {
        color: $test-var-color;
        background-color: var(--vt-c-black);
        cursor: pointer;
      }
    }
  }
}
</style>
