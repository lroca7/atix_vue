<template>
    <div class="ax-loading">
        <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
        ></v-progress-circular>
    </div>
</template>
<style scoped>
.v-progress-circular {
    margin: 1rem;
}
.ax-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}
</style>
