---
name: suftty
description: A real browser running inside the terminal. It splits the human's terminal pane automatically, so you can show a website side by side with the conversation, render HTML to visualize something, and drive whatever tab is open — snapshot, click, fill, eval — with the `suftty action` subcommand.
---

`suftty open <url>` puts a browser in a terminal pane. On its own it
takes over the current pane. `--split right` (or `down`, `left`, `up`) opens a
new pane beside the human, which is how you show a page next to the
conversation. A path to a local html file works the same as a url, so writing a
page and opening it is a way to show something you built.

`suftty ls` shows the browsers and tabs in this terminal tab, with the
tab ids the other commands take.

`suftty action -- <command>` is an agent-browser compatible CLI for a
tab that is already open. It targets this terminal tab's browser and its active
tab unless you select another one.

When you use the suftty action sub command, the user will visually
see in the browser tab an indication that you are acting on the browser tab. This
will automatically hide after a preset duration, where the countdown resets
everytime suftty action is used. But its a much better experience
for the user if after the last time you plan to use suftty action you
run suftty action done, which immediately clears the indication
that you are using the browser tab

Some pages publish WebMCP tools: named actions with a JSON schema that the
page runs itself. agent-browser announces them when a page has them, and
`suftty action -- webmcp list --json` shows the full schemas. Prefer
`suftty action -- webmcp invoke <tool> --params '<json>'` over
snapshot, click and fill when a tool covers what you need; it is faster and
does not break when the layout changes. Tools can carry annotations. Treat
`readOnly: false` as a change to the user's data and `consequential: true` as
something to confirm with the user before invoking.

## Command reference
