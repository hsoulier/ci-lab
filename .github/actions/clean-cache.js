module.exports = async ({ github, context }, onlyBuilds) => {
  console.log("About to clear")
  const branchName = context.payload.ref.replace("refs/heads/", "")

  console.log(branchName)

  const { data: pull } = await github.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: "open",
  })

  const pullList = pull.filter((pr) => pr.head.ref === branchName)
  console.log("List of PR", pullList.length)
  console.dir(pullList, { depth: null })
  if (pullList.length === 0) {
    return
  }

  const { data: caches } = await github.rest.actions.getActionsCacheList({
    owner: context.repo.owner,
    repo: context.repo.repo,
  })
  const listCaches = caches.actions_caches.filter((cache) => {
    const prCache = cache.ref.includes(`refs/pull/${pullList[0].number}/merge`)
    return onlyBuilds ? prCache && cache.includes("build-nextjs") : prCache
  })
  console.log("List of caches", listCaches.length)
  for (const cache of listCaches) {
    github.rest.actions.deleteActionsCacheById({
      owner: context.repo.owner,
      repo: context.repo.repo,
      cache_id: cache.id,
    })
  }
  console.log("Done")
}
