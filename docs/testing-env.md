# 测试环境方案

## 目标
搭建可靠的测试流程，确保每次部署到生产前经过充分测试。

---

## 方案：Preview Deployments + 手动测试

### 架构

```
GitHub (main branch)
    │
    ├─→ Vercel Preview Deployments (自动)
    │       │
    │       └─→ https://*-ai-generate-blog.vercel.app
    │               (测试环境，使用同一数据库)
    │
    └─→ 手动部署到生产 (ops 确认后)
            │
            └─→ https://ai-generate-blog.vercel.app
                    (生产环境)
```

### 工作流程

```
1. dev 推送代码到 GitHub
       ↓
2. Vercel 自动创建 Preview 部署
       ↓
3. 在 Preview URL 测试功能
       ↓
4. 测试通过后，main 验收通过
       ↓
5. ops 执行: vercel --prod
       ↓
6. 生产部署完成
```

---

## 实施步骤

### 1. Vercel Preview 已自动启用 ✅

Vercel 默认支持 Preview 部署，每次推送都会自动创建预览 URL。

**查看 Preview：**
```bash
vercel list
```

### 2. 测试检查清单

每次 Preview 测试需确认：
- [ ] 首页加载正常 (200)
- [ ] 博客文章列表显示
- [ ] 搜索功能正常
- [ ] 订阅功能正常
- [ ] RSS 订阅正常

### 3. 部署命令

```bash
# 预览部署列表
vercel list

# 部署到生产（测试通过后）
vercel --prod

# 回滚到上一版本
vercel rollback ai-generate-blog
```

---

## 备选方案：独立 Staging 环境（可选）

如果需要独立测试数据库：

1. **创建新 Supabase 项目**（需要 Harry 授权）
2. **创建新 Vercel 项目**
3. **配置不同环境变量**

---

## 当前状态

| 环境 | URL | 状态 |
|------|-----|------|
| 生产 | https://ai-generate-blog.vercel.app | ✅ 运行中 |
| Preview | https://*-ai-generate-blog.vercel.app | ✅ 自动创建 |

---

## 下一步

1. dev 开发完成 → 推送 GitHub
2. Vercel 自动创建 Preview
3. 测试 Preview 功能
4. main 验收
5. ops 部署到生产
