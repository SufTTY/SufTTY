
interface CommandHelp {
  summary: string;
  usage: string;
  body: string;
}

const COMMANDS: Record<string, CommandHelp> = {
  open: {
    summary: "Open the browser in a terminal pane",
    usage: "suftty open [url] [options]",
    body: `
Opens the browser in the current pane. Pass --split to open it in a new
split pane instead.

The url can be a normal url, a localhost port, or a path to an html file.

Options:
  --split <direction>   Open in a new pane: right, left, down, up
  --size <fraction>     How much of the space the split takes (0.2 to 0.95)
  --ssh <user@host>     Perform all network requests through a remote server, then
                        proxy the result back to the local suftty instance
  --allow-clipboard-read
                        Lets websites read from clipboard.
  --transparent         [placeholder copy: Let the terminal show through pages that do not paint
                        a background. Persist it with suftty config set window.transparent on]
  --no-merge            Do not open the suftty instance as a tab in a neighbor suftty


Examples:
  suftty open localhost:3000
  suftty open ./report.html --split right
  suftty open github.com/SufTTY/suftty --split down --size 0.4
  suftty open --ssh dev@build-box localhost:8080
`,
  },
  ls: {
    summary: "List running browsers and their tabs",
    usage: "suftty ls [options]",
    body: `
Lists the browsers running in this terminal tab, each with its tabs. The tab
ids it prints are what --tab takes in suftty action.

Options:
  --all               Every browser, not just this terminal tab
  --json              Machine readable, including cdp ports and pane ids
`,
  },
  setup: {
    summary: "Configure terminals and agents so suftty works best",
    usage: "suftty setup",
    body: `
Sets up configuration to make suftty work best, this includes:
- installing agent skills

`,
  },
  upgrade: {
    summary: "Upgrade to the latest release",
    usage: "suftty upgrade",
    body: `
Checks this install's release channel and installs the latest version. Does
nothing when already up to date.
`,
  },
  "new-tab": {
    summary: "Open a tab here, and a browser too if there is none",
    usage: "suftty new-tab [url] [options]",
    body: `
Opens a tab in a browser already open. By default, if there is a single
browser open in the current terminal tab, it will open a tab in that browser.
If there are no browsers, a new browser will be opened with the specified tab
as the initial (if ran from a shell without a TTY, it will open in a split to
the right). If there are multiple browsers, new-tab will error and a
--browser <key> is a required argument (<key> can be found by running
suftty ls)

Options:
  --browser <key>     A browser key from suftty ls

Examples:
  suftty new-tab github.com
  suftty new-tab --browser 90107-1 localhost:3000
`,
  },
  "clear-browsing-data": {
    summary: "Clear cookies, site data and cache, like a browser's Clear browsing data",
    usage: "suftty clear-browsing-data [options]",
    body: `
Clears cookies and site data, and cached images and files, for every site in
every suftty window, signing you out. Asks first when run in a
terminal; otherwise needs --yes. Reload open pages to see the change.

Options:
  -y, --yes           Clear without asking
  --cookies           Only clear cookies and site data
  --cache             Only clear cached images and files
  --browser <key>     A browser key from suftty ls

Examples:
  suftty clear-browsing-data
  suftty clear-browsing-data --yes --cookies
`,
  },
  apps: {
    summary: "Lists registered suftty apps",
    usage: "suftty apps [--json]",
    body: `
Lists the id, name, and binary path of registered suftty apps. Apps can be registered
using suftty register-app. If an app is registered it can be opened through the suftty
new tab command palette after searching for its name.
`,
  },
  "register-app": {
    summary: "Register a suftty application",
    usage: "suftty register-app --name <name> --bin <path> [--id <id>] [--args \"…\"]",
    body: `
Registers metadata for a suftty application to ~/.local/share/suftty-interop/apps/<id>.json. This enables functionality
when a user is using suftty, and lets other applications discover suftty apps.
`,
  },
  "unregister-app": {
    summary: "Unregister a suftty application",
    usage: "suftty unregister-app <id>",
    body: `
Remove application metadata from ~/.local/share/suftty-interop/apps/<id>.json.
`,
  },
  shutdown: {
    summary: "Stop the daemon",
    usage: "suftty shutdown",
    body: `
Every browser in a terminal pane shares one browser process as an optimization. To
fully quit suftty operations, you can use this shutdown command. This will
close all open browsers.
`,
  },
  config: {
    summary: "Get and set settings and shortcuts",
    usage: "suftty config <list|get|set|unset|path> [key] [value]",
    body: `
Reads and writes the settings.json and shortcuts.json files.

Settings are addressed by their settings.json key. Shortcuts are addressed as
shortcuts.<command> and take a comma separated list of key chords, or none to
unbind. unset restores the default.

Commands:
  list                 List every setting and shortcut with its current value
  get <key>            Print the value of one key
  set <key> <value>    Set a key
  unset <key>          Restore a key to its default
  path                 Print the paths of the config files

Examples:
  suftty config list
  suftty config get search.engine
  suftty config set telemetry.usage off
  suftty config set updates.check off
  suftty config set shortcuts.tab.new "cmd+t,ctrl+t"
  suftty config set shortcuts.record.toggle none
  suftty config unset render.fps
  suftty config path
`,
  },
  action: {
    summary: "Use the open browser through the agent-browser CLI",
    usage: "suftty action [selectors] -- <command>",
    body: `
An agent-browser compatible CLI for the browser you already have open.
Everything after -- is an agent-browser command. With no selectors it targets
the browser in this terminal tab and that browser's active tab.

Selectors:
  --browser <key>     A browser key from suftty ls
  --tab <id>          A tab id from suftty ls
  --target <id>       A CDP target id
  --follow            Bring the tab to the front before running the command

Examples:
  suftty action -- snapshot
  suftty action -- click @e14
  suftty action -- eval "document.title"
  suftty action --browser 90107-1 --tab 2 -- fill @e3 "hello"
  suftty action done
`,
  },
};

function block(text: string): string {
  return `${text.trim()}\n`;
}

export function rootHelp(): string {
  const width = Math.max(...Object.keys(COMMANDS).map((name) => name.length));
  const lines = Object.entries(COMMANDS).map(
    ([name, help]) => `  ${name.padEnd(width)}  ${help.summary}`,
  );
  return block(`
Usage: suftty [url] [options]
       suftty <command> [args]

${lines.join("\n")}

suftty <command> --help for one command's options
suftty --version prints the installed version
`);
}

export function commandHelp(name: string): string | null {
  const help = COMMANDS[name];
  if (!help) return null;
  return block(`Usage: ${help.usage}\n${help.body}`);
}

export function helpTopics(): string[] {
  return Object.keys(COMMANDS);
}
