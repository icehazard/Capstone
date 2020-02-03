<template>
  <section>
    <top></top>
    <waves></waves>
    <DataTable></DataTable>
  </section>
</template>
<script>
import waves from "../welcome/waves";
import top from "../welcome/top";
import DataTable from "../welcome/table";

export default {
  components: {
    waves,
    DataTable,
    top
  }
};
</script>

<style lang="less" scoped>


</style>
