export async function getFundamentalScore(token: string): Promise<number> {
  const tvl = await fetchTVL(token)
  const auditScore = await fetchAuditStatus(token)
  const githubScore = await fetchGitHubActivity(token)

  // Score sur 100
  return (tvl + auditScore + githubScore) / 3
}

async function fetchTVL(token: string) {
  const res = await fetch(`https://api.llama.fi/protocol/${token}`)
  const data = await res.json()
  return Math.min(data.tvl / 1e7, 40) // 40 points max
}

async function fetchAuditStatus(token: string) {
  const audits = {
    Uniswap: 30,
    Aave: 40,
    Sologenic: 25,
  }
  return audits[token] || 10
}

async function fetchGitHubActivity(token: string) {
  const repo = getRepo(token)
  const res = await fetch(`https://api.github.com/repos/${repo}/commits`)
  const commits = await res.json()
  return Math.min(commits.length / 5, 20) // max 20
}

function getRepo(token: string) {
  const repos = {
    Uniswap: 'Uniswap/v3-core',
    Aave: 'aave/protocol-v2',
    Sologenic: 'sologenic/sologenic-core',
  }
  return repos[token]
}

