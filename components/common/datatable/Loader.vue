<template>
  <table class="">
    <thead>
      <DatatableRow>
        <template v-for="index in 4">
          <DatatableTH :align="index === 4 ? 'right' : 'left'">
            <Skeleton
              class="h-3 w-24"
            />
          </DatatableTH>
        </template>
      </DatatableRow>
    </thead>
    <tbody>
      <template v-for="index in 10">
        <DatatableRow>
          <template v-for="index2 in 4">
            <DatatableTD>
              <Skeleton
                class="h-5"
                :class="{
                  'w-1/2': index2 === 1,
                  'w-4/5': index2 === 2,
                  'ml-auto w-10/12': index2 === 4,
                }"
              />
            </DatatableTD>
          </template>
        </DatatableRow>
      </template>
    </tbody>
  </table>
</template>
