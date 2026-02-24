# Blog v3 - Design Document

## 1. Modifications Overview

- **Project Name**: "AIgenerate Block System"
- **Design Style**: Anthropic brand colors
- **New Feature**: Light/Dark mode toggle

## 2. Color Palette

### Light Mode (Anthropic)
| 用途 | 颜色 |
|------|------|
| Background | `#faf9f5` |
| Text | `#141413` |
| Secondary | `#b0aea5` |
| Accent Orange | `#d97757` |
| Surface | `#ffffff` |
| Border | `#e8e6e1` |

### Dark Mode
| 用途 | 颜色 |
|------|------|
| Background | `#141413` |
| Text | `#faf9f5` |
| Secondary | `#b0aea5` |
| Accent Orange | `#d97757` |
| Surface | `#1c1c1a` |
| Border | `#2c2c2a` |

## 3. Typography

- **Headings**: "Poppins", sans-serif
- **Body**: "Lora", serif
- **Code**: "JetBrains Mono", monospace
- Base size: 18px
- Line height: 1.7

## 4. Components

### Theme Toggle
- Icon button (sun/moon)
- Position: Header right side
- Smooth transition between modes

## 5. Changes Required

### Global
- [ ] Update blog name to "AIgenerate Block System"
- [ ] Change fonts to Poppins + Lora
- [ ] Implement light/dark mode CSS variables
- [ ] Add theme toggle component
- [ ] Persist theme preference (localStorage)

### Acceptance Criteria
- [ ] Blog name shows "AIgenerate Block System"
- [ ] Theme toggle works
- [ ] Theme persists on reload
- [ ] All pages use correct colors
- [ ] Build succeeds
- [ ] Tests pass
