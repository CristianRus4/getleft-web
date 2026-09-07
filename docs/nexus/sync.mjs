import { readFile } from "node:fs/promises"
import { execFileSync } from "node:child_process"
import path from "node:path"

const root = path.resolve(new URL("../../", import.meta.url).pathname)
const manifest = JSON.parse(await readFile(new URL("manifest.json", import.meta.url), "utf8"))
const files = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean)

function matcher(pattern) {
  const token = "__DOUBLE_STAR__"
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replaceAll("**", token).replaceAll("*", "[^/]*").replaceAll(token, ".*")
  return new RegExp(`^${escaped}$`)
}

const documents = []
for (const source of manifest.sources) {
  const selected = files.filter((file) => source.include.some((pattern) => matcher(pattern).test(file)))
  for (const sourcePath of selected) {
    if (!/\.md$/i.test(sourcePath) || sourcePath.includes("..")) continue
    const content = await readFile(path.join(root, sourcePath), "utf8")
    if (Buffer.byteLength(content) > 200_000) throw new Error(`${sourcePath} exceeds 200 KB`)
    documents.push({ project: source.project, role: source.role, sourcePath, content })
  }
}

process.stdout.write(JSON.stringify({
  mode: "docs",
  schemaVersion: manifest.schemaVersion,
  repository: process.env.GITHUB_REPOSITORY ?? manifest.repository,
  ref: process.env.GITHUB_REF ?? "refs/heads/main",
  sha: process.env.GITHUB_SHA ?? execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  documents,
}))
