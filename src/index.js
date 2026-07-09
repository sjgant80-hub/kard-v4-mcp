#!/usr/bin/env node
// kard-v4-mcp · MCP stdio server wrapping kard-v4-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'kard-v4-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'kard-v4_count_spine_factors',
    description: 'countSpineFactors · from kard-v4-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { countSpineFactors } = await import('@ai-native-solutions/kard-v4-sdk');
      return typeof countSpineFactors === 'function' ? await countSpineFactors(args) : { error: 'countSpineFactors not callable' };
    }
  },
  {
    name: 'kard-v4_spine_factors',
    description: 'spineFactors · from kard-v4-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { spineFactors } = await import('@ai-native-solutions/kard-v4-sdk');
      return typeof spineFactors === 'function' ? await spineFactors(args) : { error: 'spineFactors not callable' };
    }
  },
  {
    name: 'kard-v4_category_to_faction',
    description: 'categoryToFaction · from kard-v4-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { categoryToFaction } = await import('@ai-native-solutions/kard-v4-sdk');
      return typeof categoryToFaction === 'function' ? await categoryToFaction(args) : { error: 'categoryToFaction not callable' };
    }
  },
  {
    name: 'kard-v4_derive_prime_from_name',
    description: 'derivePrimeFromName · from kard-v4-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { derivePrimeFromName } = await import('@ai-native-solutions/kard-v4-sdk');
      return typeof derivePrimeFromName === 'function' ? await derivePrimeFromName(args) : { error: 'derivePrimeFromName not callable' };
    }
  },
  {
    name: 'kard-v4_ability_for',
    description: 'abilityFor · from kard-v4-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { abilityFor } = await import('@ai-native-solutions/kard-v4-sdk');
      return typeof abilityFor === 'function' ? await abilityFor(args) : { error: 'abilityFor not callable' };
    }
  },
  {
    name: 'kard-v4_repo_to_card',
    description: 'repoToCard · from kard-v4-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { repoToCard } = await import('@ai-native-solutions/kard-v4-sdk');
      return typeof repoToCard === 'function' ? await repoToCard(args) : { error: 'repoToCard not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('kard-v4-mcp v1.0.0 · stdio ready');
