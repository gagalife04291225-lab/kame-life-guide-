# Commerce regression feed baseline

The historical product fixtures remain the identity/safety/search baseline. Only
these eight feed-owned fields can advance: `rakutenLastUpdated`, `rakutenUrl`,
`rakutenStatus`, `rakutenItemCode`, `rakutenPrice`, `rakutenShop`,
`rakutenConfidence`, `rakutenImageUrl`. Presence and values are compared exactly.
The candidate is never copied into expectations by the ordinary test path.

`tools/commerce-identity-baseline.mjs` chooses an independent committed baseline:

- Local: merge base of fetched `origin/main` and `HEAD`. Fetch the genuine upstream
  main branch first. A branch commit or uncommitted edit cannot become the baseline.
- Pull request: runner event's main base SHA, verified as ancestor of both published
  main and checked-out candidate. No PR-generated override is accepted.
- Ordinary main push: runner event's `before` SHA. Using `after` here would approve
  the change being tested, so it is not the default.
- Generated main push: only GitHub's runner actor AND event sender identifying
  `github-actions[bot]`, plus main ancestry and a feed-only product delta, permit
  the published `after` SHA. Git author/commit subject is never sufficient proof.
- Manual main check: runner's SHA must already be on published main.
- Reconcile within the existing main Rakuten workflow: `push-rakuten-update.py`
  captures the generated commit and its parent BEFORE merging concurrent work.
  It supplies these only to the offline-checker subprocess. The resolver requires
  the scheduled/manual main generator context, the captured single parent,
  parent ancestry on published main, generated ancestry on candidate, and a
  feed-only product delta. The merged candidate itself is forbidden as baseline.
  Post-merge feed edits therefore cannot approve themselves.

No network request, credentials, or live API response is needed by the tests.
Full history and `origin/main` are required; missing/shallow inputs fail closed
with a fetch diagnostic. Site CI already uses `fetch-depth: 0`. Detached feature
manual runs and unauthenticated local generated overrides intentionally fail;
ordinary local checks use published main without overrides.

Trust boundary: GitHub-provided event/runner metadata and the fetched upstream
ref are trusted inputs. The tests do not authenticate arbitrary JSON or refs
created by a local caller, nor can candidate-controlled tests replace a protected
review/CI policy. Do not set GitHub/override variables to make a failing candidate
pass. Scheduled generation/filter rules and product data are unchanged.

Verification: `node tools/test-commerce-identity-baseline.mjs` uses throwaway Git
repositories and covers exact field tampering, candidate commits, PR/push paths,
wrong workflow/missing/shallow inputs, and pre-merge reconciliation. Existing
product regression suites still check every non-excepted identity/safety field.
`tools/test_push_rakuten_update.py` checks reconcile child scoping and pre-merge
SHA capture alongside existing race/failure behavior.
