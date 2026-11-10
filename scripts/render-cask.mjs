import fs from "node:fs";

// the aggregate manifest publish-r2.sh uploads next to the tarballs
const source = process.argv[2] ?? "https://suftty.sh/install/latest.json";
const manifest = source.startsWith("http")
  ? await (await fetch(source)).json()
  : JSON.parse(fs.readFileSync(source, "utf8"));

const required = ["darwin-arm64", "darwin-x64", "linux-x64", "linux-arm64"];
const missing = required.filter((platform) => !manifest.platforms?.[platform]);
if (missing.length) {
  console.error(`missing manifests in ${source} for: ${missing.join(", ")}`);
  process.exit(1);
}
if (manifest.channel !== "stable") {
  console.error(`refusing to render a cask for the ${manifest.channel} channel`);
  process.exit(1);
}

const version = manifest.version.replace(/^v/, "");
const sha = (platform) => manifest.platforms[platform].sha256;

process.stdout.write(`cask "suftty" do
  arch arm: "arm64", intel: "x64"
  os macos: "darwin", linux: "linux"

  version "${version}"
  sha256 arm:          "${sha("darwin-arm64")}",
         intel:        "${sha("darwin-x64")}",
         arm64_linux:  "${sha("linux-arm64")}",
         x86_64_linux: "${sha("linux-x64")}"

  url "https://suftty.sh/install/dl/stable/v#{version}/suftty-#{os}-#{arch}.tar.gz"
  name "suftty"
  desc "Terminal-based web browser"
  homepage "https://suftty.sh/"

  livecheck do
    url "https://suftty.sh/install/latest.json"
    strategy :json do |json|
      json["version"]&.delete_prefix("v")
    end
  end

  binary "suftty/bin/suftty"

  zap trash: [
    "~/.agents/skills/suftty",
    "~/.cache/suftty-*",
    "~/.claude/skills/suftty",
    "~/.codex/skills/suftty",
    "~/.cursor/skills/suftty",
    "~/.gemini/skills/suftty",
    "~/.local/share/suftty-*",
    "~/.local/state/suftty",
    "~/.local/state/suftty-*",
  ]
end
`);
