<template>
  <nav class="app-nav">
    <div class="nav-inner">
      <!-- Logo -->
      <div class="nav-logo">
        <img src="https://cf.shopee.tw/file/tw-50009109-7f0b67c8ef8e3fffd029e6c2b6e0b0b8" alt="蝦皮購物" class="logo-img" />
        <span class="logo-text">蝦皮購物</span>
      </div>

      <!-- Icons -->
      <div class="nav-icons">
        <button class="icon-btn" aria-label="搜尋">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button class="icon-btn" aria-label="購物車">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </button>
        <button class="icon-btn" aria-label="訊息">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </button>
        <button class="icon-btn" aria-label="通知">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
        <button class="icon-btn" aria-label="帳號">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="nav-divider"></div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  max-width: 1280px;
  margin: 0 auto;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.logo-img {
  height: 36px;
  width: auto;
  display: none; /* fallback if img fails */
}

.logo-text {
  background: #ee4d2d;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  font-family: 'Noto Sans TC', sans-serif;
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn {
  background: none;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #555;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.icon-btn:hover {
  border-color: #ee4d2d;
  color: #ee4d2d;
  background: #fff5f3;
}

.nav-divider {
  height: 2px;
  background: linear-gradient(90deg, #ee4d2d 0%, #ff7849 100%);
}
</style>