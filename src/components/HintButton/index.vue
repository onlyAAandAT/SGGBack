<template>
  <a :title="title" style="display: inline-block; margin:5px;">
  <!-- p117讲过hintbutton的封装 -->
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
    name:"HintButton",
    props:["title"]
}
</script>

<style>

</style>