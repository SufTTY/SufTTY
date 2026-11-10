When using the `suftty` cli, run it with escalated permissions. The sandbox
blocks commands suftty needs internally to determine the terminal pane
this codex TUI is being ran from, so that it can split relative to the currently opened terminal pane
