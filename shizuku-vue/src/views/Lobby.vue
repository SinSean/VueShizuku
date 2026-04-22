<template>
  <div class="space-y-12">
    <section class="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
      <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
        class="w-full h-full object-cover"
        alt="Hero"
      />
      <div
        class="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white"
      >
        <h1 class="text-6xl font-black mb-4 tracking-widest">SUMMER SALE</h1>
        <p class="text-xl mb-8">2026 春夏系列全新上市，全館五折起</p>
        <Button label="立即選購" severity="contrast" size="large" rounded />
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="h-64 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center"
      >
        <span class="text-gray-400 font-bold">熱門類別 {{ i }}</span>
      </div>
    </section>
  </div>
</template>
