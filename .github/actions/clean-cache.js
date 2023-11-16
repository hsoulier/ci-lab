module.exports = async ({ github, context }) => {
  console.log("About to clear")
  // console.dir(context, { depth: null })

  const { data: pull } = await github.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: `${context.payload.owner.name}:${context.payload.ref}`,
    state: "open",
  })
  console.log("List of PR")
  console.dir(pull, { depth: null })

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
