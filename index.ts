import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getUserInfo, createCommit, listFollowing, createBranch, listRepos, getRepo, listBranches, getBranch, getFile, listRepoContents, compareBranches, deleteFile, updateFile, getLatestCommit, getPullRequests, createPullRequest } from "./functions.js";
import 'dotenv/config';


const server = new McpServer({
    name: "github-mcp-test2",
    version: "1.0.0",
  });

server.tool("get-user-info", "Gets the user info for the current user",
    async () => {
        const data = await getUserInfo();
        return {
            content: [{ type: "text", text: JSON.stringify(data) }]
        };
    }
);

server.tool("list-repos", "Lists the repositories for the current user",
    {},
    { title: "Lists the repositories for the current user" },
    async () => {
        const data = await listRepos();
        return {
            content: [{ type: "text", text: JSON.stringify(data) }]
        };
    }
);

server.tool("get-repo", "Gets a repository for the current user",
    { owner: z.string(), repo: z.string() },
    { title: "Gets a repository for the current user" },
    async ({ owner, repo }: { owner: string, repo: string }) => {
        const data = await getRepo(owner, repo);
        return {
            content: [{ type: "text", text: JSON.stringify(data) }]
        };
    }
);

server.tool("list-branches", "Lists the branches for a repository",
    { owner: z.string(), repo: z.string() },
    { title: "Lists the branches for a repository" },
    async ({ owner, repo }: { owner: string, repo: string }) => {
        const data = await listBranches(owner, repo);
        return {
            content: [{ type: "text", text: JSON.stringify(data) }]
        };
    }
);

server.tool("list-following", "Lists the GitHub users you are following", 
    {},
    { title: "Lists the GitHub users you are following" },
    async () => {
        try {
            const data = await listFollowing();
            return {
                content: [{ type: "text", text: JSON.stringify(data) }]
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }]
            };
        }
    }
);

server.tool("add",
    { a: z.number(), b: z.number() },
    { title: "Adds two numbers together"},
    async ({ a, b }: { a: number, b: number }) => ({
      content: [{ type: "text", text: String(a + b) }]
    })
);

server.tool("make-a-commit",
    { message: z.string(), content: z.string(), path: z.string(), branch: z.string(), repo: z.string() },
    { title: "Commits a change to a GitHub repository"},
    async ({ message, content, path, branch, repo }: { message: string, content: string, path: string, branch: string, repo: string }) => {
        try {
            await createCommit(message, content, path, branch, repo);
            return {
                content: [{ type: "text", text: "Commit successful" }]
            };
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }]
            };
        }
    }
); 

server.tool("create-branch", {owner: z.string(), repo: z.string(), branch: z.string(), from_branch: z.string().optional()}, 
{title: "Creates a new branch in a GitHub repository"}, 
async ({owner, repo, branch, from_branch}: {owner: string, repo: string, branch: string, from_branch?: string}) => {
    try {
        await createBranch({owner, repo, branch, from_branch});
        return {
            content: [{ type: "text", text: "Branch created successfully" }]
        };
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }]
        };
    }
});

server.tool("get-file", {owner: z.string(), repo: z.string(), path: z.string(), branch: z.string()},
{title: "Gets a file from a GitHub repository"},
async ({owner, repo, path, branch}: {owner: string, repo: string, path: string, branch: string}) => {
    const data = await getFile(owner, repo, path, branch);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

server.tool("list-repo-contents", {owner: z.string(), repo: z.string(), path: z.string(), branch: z.string()},
{title: "Lists the contents of a GitHub repository"},
async ({owner, repo, path, branch}: {owner: string, repo: string, path: string, branch: string}) => {
    const data = await listRepoContents(owner, repo, path, branch);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

server.tool("compare-branches", {owner: z.string(), repo: z.string(), base: z.string(), head: z.string()},
{title: "Compares two branches in a GitHub repository"},
async ({owner, repo, base, head}: {owner: string, repo: string, base: string, head: string}) => {
    const data = await compareBranches(owner, repo, base, head);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

server.tool("delete-file", {owner: z.string(), repo: z.string(), path: z.string(), sha: z.string(), branch: z.string()},

{title: "Deletes a file from a GitHub repository"},
async ({owner, repo, path, sha, branch}: {owner: string, repo: string, path: string, sha: string, branch: string}) => {
    const data = await deleteFile(owner, repo, path, sha, branch);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

server.tool("update-file", {owner: z.string(), repo: z.string(), path: z.string(), content: z.string(), sha: z.string(), branch: z.string()},
{title: "Updates a file in a GitHub repository"},
async ({owner, repo, path, content, sha, branch}: {owner: string, repo: string, path: string, content: string, sha: string, branch: string}) => {
    const data = await updateFile(owner, repo, path, content, sha, branch);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

server.tool("get-branch", {owner: z.string(), repo: z.string(), branch: z.string()},
{title: "Gets a branch from a GitHub repository"},
async ({owner, repo, branch}: {owner: string, repo: string, branch: string}) => {
    const data = await getBranch(owner, repo, branch);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

server.tool("get-latest-commit", {owner: z.string(), repo: z.string(), branch: z.string()},
{title: "Gets the latest commit from a GitHub repository"},
async ({owner, repo, branch}: {owner: string, repo: string, branch: string}) => {
    const data = await getLatestCommit(owner, repo, branch);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

server.tool("get-pull-requests", {owner: z.string(), repo: z.string(), state: z.enum(["all", "open", "closed"]).optional()},
{title: "Gets the pull requests for a GitHub repository"},
async ({owner, repo, state}: {owner: string, repo: string, state?: "all" | "open" | "closed"}) => {
    const data = await getPullRequests(owner, repo, state);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

server.tool("create-pull-request", {owner: z.string(), repo: z.string(), head: z.string(), base: z.string(), title: z.string(), body: z.string().optional()},

{title: "Creates a pull request for a GitHub repository"},
async ({owner, repo, head, base, title, body}: {owner: string, repo: string, head: string, base: string, title: string, body?: string}) => {
    const data = await createPullRequest(owner, repo, head, base, title, body);
    return {
        content: [{ type: "text", text: JSON.stringify(data) }]
    };
});

const transport = new StdioServerTransport();
server.connect(transport);