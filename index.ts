#!/usr/bin/env ts-node

import { program } from 'commander'
import init from './commands/init'
import generate from "./commands/generate"

program.command("init")
.description("initialize nx.config.json")
.action(init)

program.command("generate <whatToMake> <whatToNameIt>").alias("g")
.description("$ nx g, or $ nx generate <what to make> <what to name it>")
.action(generate)

program.parse()

// todo fix automatically - atomically typo in conf readme and submit a pull request