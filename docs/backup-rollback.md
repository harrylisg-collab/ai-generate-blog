# 数据库备份与回滚方案

> 最后更新：2026-02-24

---

## 1. 数据库备份

### 1.1 Supabase 自动备份

Supabase (PostgreSQL) 提供内置自动备份：

| 计划 | 备份频率 | 保留时间 | Point-in-Time Recovery |
|------|---------|---------|----------------------|
| Free | 每日 1 次 | 7 天 | ❌ |
| Pro | 每 6 小时 1 次 | 30 天 | ✅ |
| Team | 每 6 小时 1 次 | 30 天 | ✅ |

**查看备份状态：**
1. 打开 https://supabase.com/dashboard/project/pkhthszpnzyveargpalf/settings/database
2. 找到 "Database Backup" 部分

### 1.2 手动备份脚本（推荐设置）

创建每日自动备份脚本 `scripts/backup.sh`：

```bash
#!/bin/bash
# 每日数据库备份脚本

# 环境变量
source .env.local

# 备份文件名
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
BACKUP_DIR="./backups"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
pg_dump "$POSTGRES_URL" > "$BACKUP_DIR/$BACKUP_FILE"

# 压缩备份
gzip "$BACKUP_DIR/$BACKUP_FILE"

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

**设置定时任务（每日凌晨 3 点）：**
```bash
# 添加到 crontab
crontab -e

# 添加行：
0 3 * * * cd /path/to/anthropic-blog && ./scripts/backup.sh >> backup.log 2>&1
```

---

## 2. 回滚方案

### 2.1 Vercel 部署回滚

#### 方式一：Dashboard（推荐）

1. 打开 https://vercel.com/dashboard
2. 进入 **ai-generate-blog** 项目
3. 点击 **Deployments** 标签
4. 找到正常工作的部署（状态为 ✅ Ready）
5. 点击右侧 **"..."** 按钮
6. 选择 **"Promote to Production"**

![Vercel Rollback](https://vercel.com/docs/images/deployments/rollback.png)

#### 方式二：CLI

```bash
# 回滚到上一个生产部署
vercel rollback ai-generate-blog

# 指定回滚到特定部署
vercel rollback ai-generate-blog --deployment dpl_xxx
```

#### 方式三：API

```bash
# 1. 获取部署历史
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=prj_dZv2B3t2HbflyhR33rQBthjBA5pe&target=production&limit=10"

# 2. 回滚到特定部署（将 dpl_xxx 替换为目标部署 ID）
curl -s -X POST -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments/dpl_xxx/promote"
```

### 2.2 数据库恢复

> ⚠️ 数据库恢复会覆盖现有数据，请谨慎操作！

#### 方式一：从 Supabase 备份恢复

1. 打开 https://supabase.com/dashboard/project/pkhthszpnzyveargpalf/settings/database
2. 找到 **"Point in Time Recovery"** 或 **"Restore"** 部分
3. 选择要恢复的时间点
4. 确认恢复

#### 方式二：从手动备份恢复

```bash
# 解压备份文件
gunzip backup_20260224_030000.sql.gz

# 恢复数据库（会覆盖现有数据）
psql "$POSTGRES_URL" < backup_20260224_030000.sql

# 或使用压缩流直接恢复
gunzip -c backup_20260224_030000.sql.gz | psql "$POSTGRES_URL"
```

---

## 3. 紧急响应流程

### 3.1 网站返回 500 错误

**快速排查：**

1. 检查 Vercel Deployment 状态
   ```bash
   curl -s -o /dev/null -w "%{http_code}" https://ai-generate-blog.vercel.app
   ```

2. 查看 Vercel Function 日志
   - Dashboard → Deployments → 点击最新部署 → 查看 **Functions** 日志

3. 常见问题：
   - **数据库连接失败** → 检查 POSTGRES_URL 环境变量
   - **SSL 证书错误** → 确认 NODE_TLS_REJECT_UNAUTHORIZED=0
   - **表不存在** → 运行数据库初始化

**解决：**
```bash
# 重新部署（使用上一个稳定的提交）
vercel rollback ai-generate-blog
```

### 3.2 数据库故障

1. 确认数据库可访问
   ```bash
   psql "$POSTGRES_URL" -c "SELECT 1;"
   ```

2. 如有问题，联系 Supabase 支持

---

## 4. 当前配置

### 4.1 项目信息

| 项目 | 值 |
|------|-----|
| 项目名 | ai-generate-blog |
| Vercel 项目 ID | prj_dZv2B3t2HbflyhR33rQBthjBA5pe |
| Vercel Team ID | team_AGS7i5xQgnQZ3B277kZiYfY9 |
| 数据库 | Supabase (pkhthszpnzyveargpalf) |
| 备份 | Supabase 自动（每日） |
| Node 版本 | 24.x |

### 4.2 环境变量

| 变量名 | 说明 |
|--------|------|
| POSTGRES_URL | Supabase 连接字符串（Pooling） |
| POSTGRES_URL_NON_POOLING | Supabase 直接连接 |
| NEXTAUTH_SECRET | NextAuth 密钥 |
| NEXTAUTH_URL | 网站 URL |
| SUPABASE_* | Supabase API 密钥 |

### 4.3 域名

| 域名 | 状态 |
|------|------|
| https://anthropic-blog.vercel.app | ✅ 正常 |
| https://ai-generate-blog.vercel.app | ✅ 正常 |

### 4.4 链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/pkhthszpnzyveargpalf
- **Vercel API Docs**: https://vercel.com/docs/api

---

## 5. 监控与维护

### 5.1 定期检查清单

- [ ] 每周检查 Vercel Deployments 状态
- [ ] 每月验证一次备份是否正常
- [ ] 检查 Supabase 项目用量（存储、带宽）
- [ ] 更新依赖包（安全更新）

### 5.2 告警设置（可选）

可以使用 Vercel Analytics 和 Healthchecks：

1. 设置 health check 端点
2. 使用 uptime robot 或 cron-job.org 监控

---

## 6. 快速命令参考

```bash
# 部署
vercel --prod

# 回滚
vercel rollback ai-generate-blog

# 查看部署历史
vercel list

# 查看日志
vercel logs ai-generate-blog

# 手动备份
pg_dump "$POSTGRES_URL" > backup.sql

# 恢复数据库
psql "$POSTGRES_URL" < backup.sql
```
