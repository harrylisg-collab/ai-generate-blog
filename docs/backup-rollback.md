# 数据库备份与回滚方案

## 1. 数据库备份

### Supabase 自动备份

Supabase (PostgreSQL) 提供自动备份：

| 计划 | 备份频率 | 保留时间 |
|------|---------|---------|
| Free | 每日 1 次 | 7 天 |
| Pro | 每 6 小时 1 次 | 30 天 |
| Team | 每 6 小时 1 次 | 30 天 |

**检查方式：**
- 登录 Supabase Dashboard → 你的项目 → Settings → Database
- 查看 "Point in Time Recovery" 和 "Backup" 配置

### 手动备份（可选）

如需额外备份，可使用 pg_dump：

```bash
# 备份命令
pg_dump "$POSTGRES_URL" > backup_$(date +%Y%m%d).sql

# 恢复命令
psql "$POSTGRES_URL" < backup_20260224.sql
```

---

## 2. 回滚方案

### 2.1 Vercel 部署回滚

**方式一：Dashboard**
1. 打开 https://vercel.com/dashboard
2. 进入 ai-generate-blog 项目
3. 点击 Deployments 标签
4. 找到正常工作的部署 → 点击 "..." → "Promote to Production"

**方式二：CLI**
```bash
vercel rollback ai-generate-blog
```

**方式三：API**
```bash
# 获取部署历史
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=prj_xxx&target=production"

# 回滚到特定部署
curl -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments/dpl_xxx/promote"
```

### 2.2 数据库恢复

如果需要恢复数据库：

1. **从 Supabase 备份恢复**
   - Supabase Dashboard → Settings → Database
   - 点击 "Restore database"
   - 选择备份时间点

2. **从手动备份恢复**
   ```bash
   psql "$POSTGRES_URL" < backup_20260224.sql
   ```

---

## 3. 文档记录

### 当前配置

| 项目 | 值 |
|------|-----|
| 项目名 | ai-generate-blog |
| Vercel 项目 ID | prj_dZv2B3t2HbflyhR33rQBthjBA5pe |
| 数据库 | Supabase (pkhthszpnzyveargpalf) |
| 备份 | Supabase 自动（每日） |

### 域名

- https://anthropic-blog.vercel.app
- https://ai-generate-blog.vercel.app

### 紧急联系人

- Vercel: https://vercel.com/dashboard
- Supabase: https://supabase.com/dashboard/project/pkhthszpalf

---

pnzyvearg## 4. 监控建议

- 定期检查 Vercel Deployments 状态
- 关注 Supabase 项目用量和备份状态
- 记录重大变更前的数据库快照
