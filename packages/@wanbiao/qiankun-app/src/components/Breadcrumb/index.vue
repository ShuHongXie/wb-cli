<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta?.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta?.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onBeforeMount, reactive } from 'vue';
  import pathToRegexp from 'path-to-regexp';
  import {
    useRoute,
    useRouter,
    RouteLocationMatched,
    _RouteRecordBase,
    RouteRecordRaw
  } from 'vue-router';
  import { log } from 'console';
  const route = useRoute();
  const router = useRouter();
  let levelList = ref<_RouteRecordBase[]>([]);
  const isDashboard = (route) => {
    const name = route && route.name;
    if (!name) {
      return false;
    }
    return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
  };
  const pathCompile = (path) => {
    // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
    const { params } = route;
    var toPath = pathToRegexp.compile(path);
    return toPath(params);
  };
  const handleLink = (item) => {
    const { redirect, path } = item;
    if (redirect) {
      router.push(redirect);
      return;
    }
    router.push(pathCompile(path));
  };
  const getBreadcrumb = () => {
    // only show routes with meta.title
    let matched = route.matched.filter(
      (item) => item.meta && item.meta.title
    ) as _RouteRecordBase[];
    const first = matched[0];

    if (!isDashboard(first)) {
      const defaultEntry = [
        { path: '/dashboard', meta: { title: 'Dashboard' } }
      ] as _RouteRecordBase[];
      matched = defaultEntry.concat(matched);
    }
    levelList.value = matched.filter(
      (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
    );
  };
  watch(
    () => route,
    () => {
      getBreadcrumb();
    }
  );
  onMounted(() => {
    getBreadcrumb();
  });
</script>

<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
