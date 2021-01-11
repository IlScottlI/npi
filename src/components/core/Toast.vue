<template>
  <div id="toast" />
</template>
<script>
  import notify from 'devextreme/ui/notify'

  export default {
    props: {
      options: {
        type: Object,
        required: true,
        default: () => {},
      },
    },
    created () {
      this.notifyToast()
    },
    methods: {
      notifyToast () {
        notify(this.options.text, this.options.type, this.options.time)
      },
    },
  }
</script>
<style>
#toast {
  padding: 10px;
}

#toast ul {
  text-align: center;
  list-style-type: none;
  margin: 20px 0;
}

#toast ul li {
  display: inline-block;
  width: 160px;
  margin: 10px;
}

#toast ul li img {
  width: 100px;
}

.dx-toast-content {
  min-width: 300px;
  max-width: 400px;
}
</style>
