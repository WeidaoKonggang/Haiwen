/**
 * 把 mock-data.ts 和 cases-data.ts 中的所有数据向量化写入 Supabase
 *
 * 运行方式：
 *   npx tsx scripts/seed-rag.ts
 *
 * 需要先配置好 .env.local 中的：
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY（或 NEXT_PUBLIC_SUPABASE_ANON_KEY）
 *   DEEPSEEK_API_KEY
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import {
  policyData,
  esgStandardsData,
  expertData,
  riskEventData,
} from '../lib/mock-data'
import { casesData } from '../lib/cases-data'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch('https://api.deepseek.com/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-embedding',
      input: text.slice(0, 8000),
    }),
  })
  if (!res.ok) throw new Error(`Embedding failed: ${await res.text()}`)
  const json = await res.json()
  return json.data[0].embedding
}

async function upsert(content: string, metadata: Record<string, string>) {
  console.log(`  向量化: ${content.slice(0, 50)}...`)
  const embedding = await getEmbedding(content)
  const { error } = await supabase.from('documents').insert({
    content,
    metadata,
    embedding,
  })
  if (error) throw error
  await new Promise((r) => setTimeout(r, 300)) // 避免限流
}

async function main() {
  console.log('=== 海问 HQ RAG 数据写入开始 ===\n')

  // 1. 政策库
  console.log(`[1/5] 写入政策库 (${policyData.length} 条)`)
  for (const p of policyData) {
    const content = [
      `政策名称：${p.title}`,
      `国家/地区：${p.country}`,
      `类型：${p.type}`,
      `风险等级：${p.riskLevel === 'high' ? '高' : p.riskLevel === 'medium' ? '中' : '低'}`,
      `生效日期：${p.effectiveDate}`,
      `摘要：${p.summary}`,
      `核心要点：\n${p.keyPoints.map((k, i) => `${i + 1}. ${k}`).join('\n')}`,
    ].join('\n')

    await upsert(content, {
      type: 'policy',
      id: p.id,
      country: p.country,
      riskLevel: p.riskLevel,
    })
  }

  // 2. ESG 标准
  console.log(`\n[2/5] 写入 ESG 标准 (${esgStandardsData.length} 条)`)
  for (const s of esgStandardsData) {
    const content = [
      `ESG 标准：${s.name}`,
      `发布机构：${s.org}`,
      `版本：${s.version}`,
      `摘要：${s.summary}`,
      `覆盖维度：${s.dimensions.join('；')}`,
      `适用场景：${s.applicability}`,
    ].join('\n')

    await upsert(content, {
      type: 'esg',
      id: s.id,
      org: s.org,
    })
  }

  // 3. 案例库
  console.log(`\n[3/5] 写入案例库 (${casesData.length} 条)`)
  for (const c of casesData) {
    const content = [
      `企业案例：${c.company}`,
      `行业：${c.industry}`,
      `出海地区：${c.region}`,
      `年份：${c.year}`,
      `核心挑战：${c.challenge}`,
      `解决方案：${c.solution}`,
      `ESG 影响：${c.esgImpact}`,
    ].join('\n')

    await upsert(content, {
      type: 'case',
      id: c.id,
      region: c.region,
      industry: c.industry,
    })
  }

  // 4. 风险事件
  console.log(`\n[4/5] 写入风险事件 (${riskEventData.length} 条)`)
  for (const r of riskEventData) {
    const content = [
      `风险事件：${r.title}`,
      `风险等级：${r.level === 'high' ? '高' : r.level === 'medium' ? '中' : '低'}`,
      `类别：${r.category}`,
      `地区：${r.region}`,
      `日期：${r.date}`,
      `描述：${r.description}`,
      `潜在影响：${r.impact}`,
      `建议措施：${r.suggestion}`,
    ].join('\n')

    await upsert(content, {
      type: 'risk',
      id: r.id,
      region: r.region,
      level: r.level,
    })
  }

  // 5. 专家信息
  console.log(`\n[5/5] 写入专家信息 (${expertData.length} 条)`)
  for (const e of expertData) {
    const content = [
      `专家：${e.name}`,
      `职位：${e.title}`,
      `机构：${e.institution}`,
      `简介：${e.bio}`,
      `专长领域：${e.specialties.join('、')}`,
      `从业年限：${e.experience}`,
    ].join('\n')

    await upsert(content, {
      type: 'expert',
      id: e.id,
    })
  }

  console.log('\n=== 全部写入完成 ===')
}

main().catch((err) => {
  console.error('写入失败:', err)
  process.exit(1)
})
