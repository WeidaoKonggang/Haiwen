/**
 * Embedding 连通性自测
 *
 * 运行：
 *   npx tsx scripts/test-embedding.ts
 *
 * 只调用 provider 的 embeddings 接口，不写数据库。
 */

import { config as loadEnv } from 'dotenv'
import path from 'path'

loadEnv({ path: path.resolve(process.cwd(), '.env.local') })
loadEnv({ path: path.resolve(process.cwd(), '.env') })

import { getEmbedding, getEmbeddingDimension } from '../lib/embedding'

async function main() {
  const provider = process.env.EMBEDDING_PROVIDER ?? 'zhipu'
  const model = process.env.EMBEDDING_MODEL ?? '(provider 默认)'
  console.log(`Provider: ${provider} | Model: ${model} | 期望维度: ${getEmbeddingDimension()}`)

  const sample = '欧盟人工智能法案对中国 AI 企业有哪些合规要求？'
  console.log(`\n向量化样本：${sample}`)

  const start = Date.now()
  const vec = await getEmbedding(sample)
  const ms = Date.now() - start

  console.log(`\n成功：向量维度 = ${vec.length}，耗时 ${ms}ms`)
  console.log(`前 5 维：${vec.slice(0, 5).map((v) => v.toFixed(4)).join(', ')}`)

  if (vec.length !== getEmbeddingDimension()) {
    console.warn(
      `⚠️ 实际维度 ${vec.length} 与 provider 声明维度 ${getEmbeddingDimension()} 不一致，请同步更新 Supabase 的 documents 列维度。`
    )
  }
}

main().catch((err) => {
  console.error('\n测试失败：')
  console.error(err.message ?? err)
  process.exit(1)
})
