<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p class="test-var">Test var</p>
  </div>
</template>

<style lang="scss" scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;

    $test-var-color: yellow;

    .test-var {
      width: fit-content;
      padding: 4px;
      color: $color-primary;

      &:hover {
        color: $test-var-color;
        background-color: var(--vt-c-black);
        cursor: pointer;
      }
    }
  }
}
</style>
