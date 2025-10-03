import { useState, useEffect } from 'react'

interface GitCommit {
  hash: string
  message: string
  date: string
  author: string
}

interface GitInfo {
  branch: string
  remoteBranch: string | null
  latestCommit: GitCommit
  isLoading: boolean
  error: string | null
}

export function useGitInfo(): GitInfo {
  const [gitInfo, setGitInfo] = useState<GitInfo>({
    branch: '',
    remoteBranch: null,
    latestCommit: { hash: '', message: '', date: '', author: '' },
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const fetchGitInfo = async () => {
      try {
        // Fetch git info from our API endpoint
        const response = await fetch('http://localhost:3001/api/git-info')
        
        if (!response.ok) {
          throw new Error('Failed to fetch git information')
        }
        
        const data = await response.json()
        setGitInfo({
          branch: data.branch,
          remoteBranch: data.remoteBranch,
          latestCommit: data.latestCommit,
          isLoading: false,
          error: null
        })
      } catch (error) {
        // Fallback to static data if API is not available
        setGitInfo({
          branch: 'main',
          remoteBranch: null,
          latestCommit: {
            hash: '54fd2be',
            message: 'fix: pnpm',
            date: '2 minutes ago',
            author: 'Developer'
          },
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    fetchGitInfo()
  }, [])

  return gitInfo
}
