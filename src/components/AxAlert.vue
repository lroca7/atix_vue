<template>
    <v-alert :type="type">
        {{ text }}
    </v-alert>
</template>

<script>
export default {
    name: 'AxAlert',
    props: ['type', 'text'],
    data() {
        return {}
    }
}
</script>
