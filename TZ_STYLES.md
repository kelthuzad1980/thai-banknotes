# Техническое задание — Главная страница Thai Banknotes

## Общие сведения

- **Проект**: Каталог тайских банкнот
- **Стиль**: Музейный / премиальный / нумизматический
- **Цветовая гамма**: Золото + бордо + тёмно-коричневый

---

## Цветовая палитра

### CSS переменные

```css
:root {
  --gold: #C6A75E;
  --burgundy: #6E0F1A;
  --dark-brown: #3D2E24;
  --brown: #5C4A3A;
  --cream: #F5E7C5;
  --text-dark: #4B4035;
  --text-light: #F7F4ED;
  --text-muted: #8B7E6A;
}
```

### Основные цвета

| Назначение | Цвет | Код |
|------------|------|-----|
| Золото (кнопки, акценты) | Тёплое золото | #C6A75E |
| Бордо (hover кнопок) | Насыщенный бордо | #6E0F1A |
| Тёмно-коричневый (фон, текст) | Тёмный орех | #3D2E24 |
| Кремовый | Слоновая кость | #F5E7C5 |

---

## Шапка (Header)

### Структура HTML

```html
<header id="header">
  <nav class="navbar">
    <a href="index.html" class="navbar__logo">
      <div class="brand">
        <img src="assets/images/lotus-logo.png" class="logo-img" alt="Thai Banknotes">
        <div class="logo-text">
          <div class="brand-top">
            <span>Thai</span>
            <span class="brand-line"></span>
          </div>
          <div class="brand-bottom">Banknotes</div>
        </div>
      </div>
    </a>
    <ul class="navbar__nav">
      <li><a href="catalog.html">Series</a></li>
      <li><a href="catalog.html">Banknotes</a></li>
      <li><a href="signature.html">Signatures</a></li>
      <li><a href="index.html" class="active">Home</a></li>
    </ul>
    <div class="navbar__actions">
      <!-- Search, Lang, Hamburger -->
    </div>
  </nav>
</header>
```

### Стили логотипа

```css
.navbar__logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.logo-img {
  width: 72px;
  height: auto;
  flex-shrink: 0;
  margin-top: -3px;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.25));
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 0.95;
  min-width: 0;
}

.brand-top {
  display: flex;
  align-items: center;
  gap: 14px;
  white-space: nowrap;
}

.brand-top span {
  font-size: 18px;
  letter-spacing: 3px;
  color: #7A1623;  /* Мягкий бордо */
}

.brand-line {
  display: block;
  width: 120px;
  height: 2px;
  background: linear-gradient(
    90deg,
    #C6A75E,
    #E7D39F,
    rgba(231,211,159,0)
  );
}

.brand-bottom {
  font-family: 'Cinzel', serif;
  font-size: 28px;
  letter-spacing: 2px;
  color: #C6A75E;
  white-space: nowrap;
  margin-top: -3px;
}
```

### Навигация

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.navbar__link {
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4B4035;
  position: relative;
  padding: 0.5rem 0;
}

.navbar__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--gold);
  transition: width 0.3s ease;
}

.navbar__link:hover::after,
.navbar__link.active::after {
  width: 100%;
}

.navbar__link.active {
  color: var(--gold);
}
```

---

## Hero-секция

### Структура

```html
<section class="hero">
  <div class="hero__border"></div>
  <div class="hero__pattern"></div>
  <div class="hero__overlay"></div>
  
  <div class="hero__content">
    <div class="hero__crown">
      <!-- SVG медальон -->
    </div>
    <h1 class="hero__title">Thai Banknotes<br>Catalogue</h1>
    <div class="hero__divider"></div>
    <p class="hero__subtitle">Complete Digital Catalogue of Thai Banknotes</p>
    <div class="hero__cta">
      <a href="catalog.html" class="btn">Explore Catalog</a>
      <a href="#series" class="btn">View Series</a>
    </div>
  </div>
  
  <div class="hero__scroll">
    <span>Scroll</span>
    <div class="hero__scroll-dot"></div>
  </div>
</section>
```

### Стили Hero

```css
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: 
    url('../assets/images/thai-pattern.png'),
    linear-gradient(135deg, #F7F4ED 0%, #EDE8DB 100%);
  overflow: hidden;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.15) 0%,
    rgba(255,255,255,0.05) 100%
  );
  z-index: 0;
}

.hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

.hero__title {
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  font-weight: 700;
  color: var(--dark-brown);
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: fadeInUp 1s ease 0.4s forwards;
}

.hero__subtitle {
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
  opacity: 0;
  animation: fadeInUp 1s ease 0.6s forwards;
}

.hero__crown svg {
  width: 180px;
  height: 180px;
}

.hero__cta {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  opacity: 0;
  animation: fadeInUp 1s ease 0.8s forwards;
}

.hero__cta .btn {
  min-width: 200px;
}
```

### Scroll-индикатор

```css
.hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0;
  animation: fadeIn 1s ease 1.2s forwards;
}

.hero__scroll-dot {
  width: 20px;
  height: 32px;
  border-radius: 999px;
  border: 2px solid rgba(59, 49, 38, 0.4);
  position: relative;
}

.hero__scroll-dot::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 8px;
  width: 7px;
  height: 7px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: var(--dark-brown);
  animation: scrollDot 2s ease infinite;
}

@keyframes scrollDot {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
  50% { transform: translateX(-50%) translateY(10px); opacity: 0.5; }
}
```

---

## Кнопки (Buttons)

### Основной класс .btn

```css
.btn { 
  display: inline-block;
  padding: 12px 26px;
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid #B8962E;
  border-radius: 4px;
  background: linear-gradient(
    180deg,
    #E7C873 0%,
    #D4AF37 50%,
    #B8962E 100%
  );
  color: #2B1A12;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  text-align: center;
  text-decoration: none;
  box-shadow: 
    0 2px 6px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.35);
}

/* Псевдоэлемент для анимации бордо-заливки */
.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #6E0F1A;
  transition: left 0.3s ease;
  z-index: -1;
}

.btn:hover { 
  color: #F5E7C5;
}

.btn:hover::before {
  left: 0;
}
```

### Кнопки-варианты

```css
.btn--primary,
.btn--burgundy,
.btn--outline {
  background: linear-gradient(
    180deg,
    #E7C873 0%,
    #D4AF37 50%,
    #B8962E 100%
  );
  border: 1px solid #B8962E;
  color: #2B1A12;
}

.btn--primary:hover,
.btn--burgundy:hover,
.btn--outline:hover {
  color: #F5E7C5;
}
```

---

## Секция серий (Timeline)

### Структура

```html
<section class="timeline" id="series">
  <div class="container">
    <div class="section__header">
      <h2 class="section__title">Banknote Series</h2>
      <p class="section__subtitle">Historical series of Thai currency</p>
    </div>
    
    <div class="timeline__items">
      <a href="catalog.html?series=first" class="timeline__item" data-era="rama-v">
        <span class="timeline__year">Rama V</span>
        <span class="timeline__label">First Series</span>
      </a>
      <!-- ... другие серии -->
    </div>
  </div>
</section>
```

### Стили Timeline

```css
.timeline {
  padding: 6rem 0;
  background: var(--cream);
}

.timeline__items {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.timeline__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 2rem;
  min-width: 140px;
  background: white;
  border: 1px solid rgba(198, 167, 94, 0.2);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.timeline__item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(198, 167, 94, 0.2);
  border-color: var(--gold);
}

.timeline__year {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--burgundy);
  margin-bottom: 0.25rem;
}

.timeline__label {
  font-size: 0.9rem;
  color: var(--dark-brown);
}
```

---

## Карточки банкнот (Banknote Cards)

### Структура

```html
<a href="banknote-detail.html" class="banknote-card fade-in">
  <div class="banknote-card__image">
    <img src="image.jpg" alt="Banknote">
    <div class="banknote-card__overlay">
      <span>View Details</span>
    </div>
  </div>
  <div class="banknote-card__content">
    <div class="banknote-card__denomination">100 Baht</div>
    <div class="banknote-card__series">Fourth Series</div>
    <div class="banknote-card__meta">
      <span class="banknote-card__year">1950</span>
      <span class="banknote-card__rarity">Common</span>
    </div>
  </div>
</a>
```

### Стили карточек

```css
.banknote-card {
  display: block;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.banknote-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 12px 32px rgba(0, 0, 0, 0.06);
}

.banknote-card__image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #E8E6DF;
}

.banknote-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.banknote-card:hover .banknote-card__image img {
  transform: scale(1.05);
}

.banknote-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(61, 46, 36, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.banknote-card:hover .banknote-card__overlay {
  opacity: 1;
}

.banknote-card__overlay span {
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 12px 26px;
  border: 1px solid #B8962E;
  border-radius: 4px;
  background: linear-gradient(
    180deg,
    #E7C873 0%,
    #D4AF37 50%,
    #B8962E 100%
  );
  color: #2B1A12;
  box-shadow: 
    0 2px 6px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.35);
  position: relative;
  overflow: hidden;
  transition: color 0.3s ease;
}

.banknote-card__overlay span::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #6E0F1A;
  transition: left 0.3s ease;
  z-index: -1;
}

.banknote-card:hover .banknote-card__overlay span {
  color: #F5E7C5;
}

.banknote-card:hover .banknote-card__overlay span::before {
  left: 0;
}

.banknote-card__content {
  padding: 1.25rem;
}

.banknote-card__denomination {
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  color: var(--dark-brown);
  margin-bottom: 0.25rem;
}

.banknote-card__series {
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.banknote-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(198, 167, 94, 0.2);
}

.banknote-card__year {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.banknote-card__rarity {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background: rgba(123, 44, 44, 0.1);
  color: var(--burgundy);
}
```

---

## Секция "Редкие банкноты" (Rare Section)

```css
.rare-section {
  background: linear-gradient(135deg, var(--dark-brown) 0%, var(--brown) 100%);
  padding: 6rem 0;
  position: relative;
  overflow: hidden;
}

.rare-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--gold) 1px, transparent 1px),
    linear-gradient(90deg, var(--gold) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.05;
}

.rare-section .section__title {
  color: var(--text-light);
}

.rare-section .section__subtitle {
  color: rgba(247, 244, 237, 0.7);
}

.rare-section .banknote-card {
  background: rgba(247, 244, 237, 0.05);
  border-color: rgba(198, 167, 94, 0.3);
}

.rare-section .banknote-card__denomination {
  color: var(--text-light);
}

.rare-section .banknote-card__series {
  color: rgba(247, 244, 237, 0.6);
}

.rare-section .banknote-card__year {
  color: rgba(247, 244, 237, 0.5);
}

.rare-section .banknote-card__meta {
  border-color: rgba(198, 167, 94, 0.2);
}

.rare-section .btn {
  background: linear-gradient(
    180deg,
    #E7C873 0%,
    #D4AF37 50%,
    #B8962E 100%
  );
  border: 1px solid #B8962E;
  color: #2B1A12;
}

.rare-section .btn:hover {
  color: #F5E7C5;
}
```

---

## Футер (Footer)

```css
footer {
  background: var(--dark-brown);
  padding: 4rem 2rem 2rem;
  color: var(--text-light);
}

.footer__content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
}

.footer__brand {
  font-family: 'Cinzel', serif;
  font-size: 1.25rem;
  color: var(--gold);
  margin-bottom: 1rem;
}

.footer__links {
  list-style: none;
  padding: 0;
}

.footer__links a {
  color: rgba(247, 244, 237, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer__links a:hover {
  color: var(--gold);
}

.footer__bottom {
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(247, 244, 237, 0.1);
  text-align: center;
  font-size: 0.85rem;
  color: rgba(247, 244, 237, 0.5);
}
```

---

## Анимации

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
```

---

## Шрифты

- **Заголовки**: 'Playfair Display', serif
- **Основной текст / кнопки / навигация**: 'Cinzel', serif
- **Подзаголовки**: 'Cinzel', serif (с letter-spacing)

### Подключение

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Адаптивность (Mobile)

### Медиа-запросы

```css
@media (max-width: 768px) {
  .hero__title {
    font-size: 36px;
  }
  
  .hero__cta {
    flex-direction: column;
    align-items: center;
  }
  
  .hero__cta .btn {
    width: 100%;
    max-width: 280px;
  }
  
  .navbar__nav {
    display: none;  /* Скрыто на мобильных, показывается через hamburger */
  }
  
  .timeline__items {
    flex-direction: column;
    align-items: center;
  }
  
  .timeline__item {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .hero__title {
    font-size: 28px;
  }
  
  .brand-top span {
    font-size: 14px;
  }
  
  .brand-bottom {
    font-size: 22px;
  }
  
  .brand-line {
    width: 80px;
  }
}
```

---

## Примечание

Все стили используют CSS-переменные для方便 модификации. Основные акцентные цвета:
- Золото: `#C6A75E`
- Бордо: `#6E0F1A`
- Тёмно-коричневый: `#3D2E24`

Кнопки имеют анимацию заливки бордовым цветом слева направо при hover.
