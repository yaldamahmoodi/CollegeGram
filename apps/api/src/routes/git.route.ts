import { Router } from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const router = Router()

router.get('/git-info', async (req, res) => {
  try {
    // Get current branch name
    const { stdout: branchName } = await execAsync('git rev-parse --abbrev-ref HEAD')
    
    // Get latest commit information with branch info
    const { stdout: latestCommit } = await execAsync('git log -1 --pretty=format:"%h|%s|%cr|%an"')
    const [hash, message, date, author] = latestCommit.trim().split('|')

    // Get remote tracking branch info if available
    let remoteBranch = null
    try {
      const { stdout: remoteInfo } = await execAsync('git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || echo ""')
      remoteBranch = remoteInfo.trim() || null
    } catch {
      // Remote tracking branch not set, that's okay
    }

    res.json({
      branch: branchName.trim(),
      remoteBranch,
      latestCommit: {
        hash,
        message,
        date,
        author
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching git info:', error)
    res.status(500).json({
      error: 'Failed to fetch git information',
      branch: 'unknown',
      latestCommit: {
        hash: 'unknown',
        message: 'Unable to fetch commit info',
        date: 'unknown',
        author: 'unknown'
      }
    })
  }
})

export default router
