<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-links">
        <a href="#" class="footer-link">常見問題</a>
        <a href="#" class="footer-link">聯絡我們</a>
        <a href="#" class="footer-link footer-link--bold">簡介</a>
      </div>
      <div class="footer-copy">copyright</div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  border-top: 1px solid #ececec;
  background: #fff;
  margin-top: 40px;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-links {
  display: flex;
  gap: 32px;
}

.footer-link {
  text-decoration: none;
  color: #555;
  font-size: 14px;
  font-family: 'Noto Sans TC', sans-serif;
  transition: color 0.18s;
}

.footer-link:hover {
  color: #ee4d2d;
}

.footer-link--bold {
  font-size: 17px;
  font-weight: 700;
  color: #222;
}

.footer-copy {
  font-size: 13px;
  color: #aaa;
  font-family: 'Noto Sans TC', sans-serif;
}
</style>