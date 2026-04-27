<template>
    <main class="w-3/4 bg-white p-8 shadow-sm border rounded">
        <h2 class="text-xl font-medium mb-2">我的檔案</h2>
        <p class="text-gray-500 text-sm mb-6">管理你的檔案以保護你的帳戶</p>
        <hr class="mb-8" />

        <form class="grid grid-cols-3 gap-8">
            <div class="col-span-2 space-y-6">
                <div class="flex items-center">
                    <label class="w-24 text-gray-600">姓名</label>
                    <input type="text" class="border p-2 w-full rounded" placeholder="請輸入姓名" />
                </div>
                <button type="submit" class="bg-orange-500 text-white px-8 py-2 rounded">儲存</button>
            </div>

            <div class="flex flex-col items-center border-l pl-8">
                <div class="w-32 h-32 bg-gray-100 rounded-full mb-4"></div>
                <button type="button" class="border px-4 py-2 text-sm">選擇圖片</button>
            </div>
        </form>
    </main>
</template>