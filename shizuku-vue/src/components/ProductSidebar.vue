<template>
<aside class="w-[240px]">    
    <ul class="space-y-3">
      
      <li v-for="item in menu" :key="item.title">
        
        <!-- 主分類 -->
        <button
          @click="toggle(item)"
          class="w-full flex justify-between items-center py-2 font-semibold hover:text-amber-600"
        >
          {{ item.title }}
          <span class="text-xs">{{ item.open ? "▾" : "▸" }}</span>
        </button>

        <!-- 子分類 -->
        <ul v-show="item.open" class="pl-3 space-y-2 text-sm text-gray-600">
          <li v-for="sub in item.children" :key="sub">
            <a href="#" class="hover:text-amber-600">
              {{ sub }}
            </a>
          </li>
        </ul>

      </li>

    </ul>
  </aside>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      menu: [
        {
          title: "風格搭配",
          open: true,
          children: ["通勤時尚Look!", "日系可愛風", "渡假休閒風"]
        },
        {
          title: "上身 / TOP",
          open: false,
          children: ["短袖", "長袖", "外套"]
        },
        {
          title: "下身 / BOTTOM",
          open: false,
          children: ["長褲", "短褲"]
        },
        {
          title: "配件 / ACCESSORIES",
          open: false,
          children: ["帽子", "包包", "襪子"]
        },
        {
          title: "洋裝",
          open: false,
          children: ["長洋裝", "短洋裝"]
        }
      ]
    };
  },
  methods: {
    toggle(item) {
      item.open = !item.open;
    }
  }
};
</script>