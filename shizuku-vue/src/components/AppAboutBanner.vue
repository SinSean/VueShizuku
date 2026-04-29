<script setup>
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

<template>  <!-- 品牌故事 Banner -->
  <div class="mb-20 text-center animate-fade-in">
    <div class="overflow-hidden mb-10">
      <img 
        src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=2000&auto=format&fit=crop" 
        alt="SHIZUKU Concept" 
        class="w-full h-[400px] md:h-[500px] object-cover filter grayscale hover:grayscale-0 transition-all duration-1000 transform hover:scale-105"
      />
    </div>
    <h1 class="text-4xl md:text-5xl font-light text-gray-900 tracking-[0.3em] uppercase mb-4">Shizuku</h1>
    <p class="text-gray-400 tracking-[0.5em] text-sm">し ず く</p>
  </div>
</template>

