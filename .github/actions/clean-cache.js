module.exports = async ({ github, context }) => {
  console.log(
    "About to clear",
    context?.payload?.repository?.owner?.login || "no values"
  )

  const { data: pull } = await github.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: "open",
  })

  const pullList = pull.filter((pr) => pr.head.ref === context.payload.ref)
  console.log("List of PR", pullList.length)
  console.dir(pullList, { depth: null })

  const { data: caches } = await github.rest.actions.getActionsCacheList({
    owner: context.repo.owner,
    repo: context.repo.repo,
  })
  const listCaches = caches.actions_caches.filter((cache) =>
    cache.ref.includes("refs/pull")
  )
  console.log("List of caches")
  console.dir(listCaches, { depth: null })
  // for (const cache of listCaches) {
  //   console.dir(cache, { depth: null })
  //   github.rest.actions.deleteActionsCacheById({
  //      owner: context.repo.owner,
  //      repo: context.repo.repo,
  //      cache_id: cache.id,
  //    })
  // }
}
