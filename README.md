# GitHub MCP Server 🚀

A Model Context Protocol (MCP) server implementation that provides a set of tools for interacting with GitHub repositories programmatically.

## Features

- User Management
  - Get user information
  - List following users

- Repository Operations
  - List repositories
  - Get repository details
  - List repository contents
  - Compare branches

- Branch Management
  - List branches
  - Get branch details
  - Create new branches
  - Get latest commit

- File Operations
  - Get file contents
  - Update files
  - Delete files
  - Create commits

- Pull Request Management
  - List pull requests
  - Create pull requests

## Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

3. Create a `.env` file with your GitHub token:
```env
GITHUB_TOKEN=your_token_here
```

## Usage

Start the MCP server(Claude):

1. Install Bun
```bash
bun index.ts
```

2. For command you may have to provide the directory of your bun. 

```bash
which bun
```

3. Add the mcp server to claude_desktop_config.json(currently only claude desktop supports mcp capabilities)
```bash
{
  "mcpServers": {
    "Github-MCP": {
      "command": "/Users/<user>>/.bun/bin/bun",
      "args": ["index.ts"]
    }
  }
}
```

### Available Tools

1. `get-user-info`
   - Gets information about the authenticated user

2. `list-repos`
   - Lists repositories for the authenticated user

3. `get-repo`
   - Parameters:
     - `owner`: Repository owner
     - `repo`: Repository name

4. `list-branches`
   - Parameters:
     - `owner`: Repository owner
     - `repo`: Repository name

5. `list-following`
   - Lists GitHub users you are following

6. `make-a-commit`
   - Parameters:
     - `message`: Commit message
     - `content`: File content
     - `path`: File path
     - `branch`: Target branch
     - `repo`: Repository name

7. `create-branch`
   - Parameters:
     - `owner`: Repository owner
     - `repo`: Repository name
     - `branch`: New branch name
     - `from_branch`: (Optional) Source branch

8. `get-file`
   - Parameters:
     - `owner`: Repository owner
     - `repo`: Repository name
     - `path`: File path
     - `branch`: Branch name

9. `list-repo-contents`
   - Parameters:
     - `owner`: Repository owner
     - `repo`: Repository name
     - `path`: Directory path
     - `branch`: Branch name

10. `compare-branches`
    - Parameters:
      - `owner`: Repository owner
      - `repo`: Repository name
      - `base`: Base branch
      - `head`: Head branch

11. `delete-file`
    - Parameters:
      - `owner`: Repository owner
      - `repo`: Repository name
      - `path`: File path
      - `sha`: File SHA
      - `branch`: Branch name

12. `update-file`
    - Parameters:
      - `owner`: Repository owner
      - `repo`: Repository name
      - `path`: File path
      - `content`: New content
      - `sha`: File SHA
      - `branch`: Branch name

13. `get-branch`
    - Parameters:
      - `owner`: Repository owner
      - `repo`: Repository name
      - `branch`: Branch name

14. `get-latest-commit`
    - Parameters:
      - `owner`: Repository owner
      - `repo`: Repository name
      - `branch`: Branch name

15. `get-pull-requests`
    - Parameters:
      - `owner`: Repository owner
      - `repo`: Repository name
      - `state`: (Optional) Filter by state ("all", "open", "closed")

16. `create-pull-request`
    - Parameters:
      - `owner`: Repository owner
      - `repo`: Repository name
      - `head`: Head branch
      - `base`: Base branch
      - `title`: PR title
      - `body`: (Optional) PR description

## Development

This project uses Bun as the runtime environment. Make sure you have Bun installed before running the project.

## License

MIT