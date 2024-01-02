<template>
  <div class="loader-sm">
    <div class="loader-sm-dot" />
    &nbsp;
    <div class="loader-sm-dot" />
    &nbsp;
    <div class="loader-sm-dot" />
  </div>
</template>

<style scoped>
@keyframes zoom-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.3);
  }
  100% {
    transform: scale(1);
  }
}

.loader-sm {
  align-items: center;
  display: inline-flex;
  flex-direction: row;
}
.loader-sm-dot {
  animation: zoom-animation 1s infinite;
  background: currentColor;
  border-radius: 50%;
  height: 10px;
  margin-right: 0.35rem;
  width: 10px;
}
.loader-sm-dot:nth-child(2) {
  animation-delay: 0.15s;
}
.loader-sm-dot:nth-child(3) {
  animation-delay: 0.3s;
}
</style>
