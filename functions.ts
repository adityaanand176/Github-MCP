import { Octokit } from "@octokit/core";
import { Buffer } from 'buffer';
import 'dotenv/config';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

interface GitHubUser {
  login: string;
}

export async function getUserInfo() {
  try {
      const { data } = await octokit.request('GET /user');
      return data;
  } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
  }
}

export async function createCommit(
  message: string,
  content: string,
  path: string,
  branch: string,
  repo: string
) {
  try {
    const currentUser = await getUserInfo();
    const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: currentUser.login,
      repo: repo,
      path: path,
      message: message, 
      content: Buffer.from(content).toString("base64"),
      branch: branch
    });
    console.log("Commit successful:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating commit:', error);
    throw error;
  }
}

export async function listFollowing() {
  try {
    const { data } = await octokit.request('GET /user/following', { headers: {'X-GitHub-Api-Version': '2022-11-28' } });
    console.log('Users you are following:', data.map((user: GitHubUser) => user.login));
    return data;
  } catch (error) {
    console.error('Error listing following:', error);
    throw error;
  }
}

export async function listRepos() {
  const { data } = await octokit.request("GET /user/repos", {
    per_page: 100
  });
  return data; 
}

export async function getRepo(owner: string, repo: string) {
  const { data } = await octokit.request("GET /repos/{owner}/{repo}", { owner, repo });
  return data;
}

export async function listBranches(owner: string, repo: string) {
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/branches", { owner, repo });
  return data;
}

export async function getBranch(owner: string, repo: string, branch: string) {
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/branches/{branch}", {
    owner, repo, branch
  });
  return data;
}

export async function createBranch({owner,repo,branch,from_branch}: 
  {owner: string; repo: string; branch: string; from_branch?: string; }
) {
  try {
    if (!from_branch) {
      const { data: repoData } = await octokit.request("GET /repos/{owner}/{repo}", {
        owner,
        repo
      });
      from_branch = repoData.default_branch;
    }
    const { data: refData } = await octokit.request("GET /repos/{owner}/{repo}/git/ref/{ref}", {
      owner,
      repo,
      ref: `heads/${from_branch}`
    });

    const sha = refData.object.sha;
    const { data: newRef } = await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha
    });

    return newRef;
  } catch (error: any) {
    console.error("Failed to create branch:", error.message);
    throw error;
  }
}

export async function updateFile(owner: string, repo: string, path: string, content: string, sha: string, branch = "main", message = "Update file") {
  const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    sha,
    branch,
  });
  return response.data;
}

export async function deleteFile(owner: string, repo: string, path: string, sha: string, branch = "main", message = "Delete file") {
  const response = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
    owner,
    repo,
    path,
    message,
    sha,
    branch,
  });
  return response.data;
}

export async function compareBranches(owner: string, repo: string, base: string, head: string) {
  const response = await octokit.request('GET /repos/{owner}/{repo}/compare/{base}...{head}', {
    owner,
    repo,
    base,
    head,
  });
  return {
    ahead_by: response.data.ahead_by,
    behind_by: response.data.behind_by,
    files: response.data.files,
  };
}



export async function getFile(owner: string, repo: string, path: string, branch: string = "main") {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      ref: branch,
    });

    if (!("content" in response.data)) throw new Error("No content found at path.");

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return {
      name: response.data.name,
      path: response.data.path,
      sha: response.data.sha,
      content,
    };
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

export async function listRepoContents(owner: string, repo: string, path: string = "", branch: string = "main") {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      ref: branch,
    });

    if (!Array.isArray(response.data)) {
      throw new Error("Path is not a directory");
    }

    return response.data.map((item: any) => ({
      name: item.name,
      path: item.path,
      type: item.type,
    }));
  } catch (error) {
    console.error("Error listing repo contents:", error);
    throw error;
  }
}

export async function getLatestCommit(owner: string, repo: string, branch: string = "main") {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
      owner,
      repo,
      ref: branch,
    });

    const commit = response.data.commit;
    const authorName = commit.author?.name ?? "Unknown Author";
    const commitDate = commit.author?.date ?? "Unknown Date";

    return {
      sha: response.data.sha,
      author: authorName,
      message: commit.message,
      date: commitDate,
    };
  } catch (error) {
    console.error("Error fetching latest commit:", error);
    throw error;
  }
}

export async function getPullRequests(owner: string, repo: string, state: "all" | "open" | "closed" = "open") {
  const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    state,
  });
  return response.data;
}

export async function createPullRequest(owner: string, repo: string, head: string, base: string, title: string, body = "") {
  const response = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    head,
    base,
    title,
    body,
  });

  return response.data;
}

//this is just for testing purposes.
// listFollowing().catch(error => {
//   console.error('Failed to list following:', error);
//   process.exit(1);
// });