<script setup>
import { ref, onMounted } from 'vue'
import { productApi } from '@/api/Product.js'

const emit = defineEmits(['categorySelected'])
const menu = ref([])

onMounted(async () => {
    try {
        const res = await productApi.getDropdowns()
        const categories = res.data.data.categories ?? []
        const parentMap = {}

        categories.forEach(cat => {
            const parts      = cat.fullName.split('-')
            const parentName = parts[0]
            const childName  = parts[1]

            if (!parentMap[parentName]) {
                parentMap[parentName] = {
                    title: parentName, open: false, children: []
                }
            }
            if (childName) {
                parentMap[parentName].children.push({
                    name:   childName,
                    id:     cat.id,
                    parent: parentName   // ✨ 記錄父分類名稱
                })
            }
        })

        menu.value = Object.values(parentMap)
    } catch (err) {
        console.error('分類載入失敗', err)
    }
})

function toggle(item) { item.open = !item.open }

function selectCategory(child) {
    // ✨ 傳 id、子分類名、父分類名
    emit('categorySelected', child.id, child.name, child.parent)
}
</script>

<template>
    <aside class="w-full">

        <button @click="$emit('categorySelected', null, null, null)"
                class="w-full text-left px-3 py-2 mb-2 text-sm font-semibold tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
            全部商品
        </button>

        <div class="border-t border-gray-100 pt-3">
            <ul class="space-y-1">
                <li v-for="item in menu" :key="item.title">

                    <button @click="toggle(item)"
                            class="w-full flex justify-between items-center px-3 py-2.5 text-sm font-semibold tracking-wider uppercase hover:text-amber-600 transition-colors">
                        {{ item.title }}
                        <span class="text-[10px] transition-transform duration-200"
                              :class="item.open ? 'rotate-90' : ''">▸</span>
                    </button>

                    <ul v-show="item.open" class="mb-2">
                        <li v-for="child in item.children" :key="child.id">
                            <a href="#"
                               @click.prevent="selectCategory(child)"
                               class="block px-6 py-1.5 text-sm text-gray-500 hover:text-amber-600 hover:pl-8 transition-all duration-200">
                                {{ child.name }}
                            </a>
                        </li>
                    </ul>

                </li>
            </ul>
        </div>

    </aside>
</template>