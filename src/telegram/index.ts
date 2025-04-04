import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';

async function run(): Promise<void> {
  try {
    const token = core.getInput('telegram_bot_token', { required: true });
    const chatId = core.getInput('telegram_chat_id', { required: true });
    const monitoredWorkflows = core.getInput('monitored_workflows').split(',').map(w => w.trim());
    
    // Only run if triggered by workflow_run
    if (github.context.eventName !== 'workflow_run') {
      core.setFailed('This action should only be triggered by workflow_run events.');
      return;
    }

    const workflowRun = github.context.payload.workflow_run;
    if (!workflowRun) {
      core.setFailed('No workflow_run object in context');
      return;
    }

    // Check if this workflow is in our monitored list (if specified)
    if (monitoredWorkflows.length > 0 && monitoredWorkflows[0] !== '' && 
        !monitoredWorkflows.includes(workflowRun.name)) {
      core.info(`Skipping notification for workflow ${workflowRun.name} - not in monitored list`);
      return;
    }

    let message = '';
    const status = workflowRun.conclusion === 'success' ? '✅ Success' : '❌ Failure';

    if (workflowRun.conclusion === 'failure') {
      // For failures, get the failed jobs
      const octokit = github.getOctokit(core.getInput('github_token', { required: true }));
      
      const { data: jobs } = await octokit.rest.actions.listJobsForWorkflowRun({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        run_id: workflowRun.id,
      });
      const failedJobs = jobs.jobs.filter(job => job.conclusion === 'failure');
      const failedJobNames = failedJobs.map(job => job.name).join(', ');

      message = `
Repository: 📂 ${github.context.repo.repo}
Status: ${status}
Workflow: 🛠️ ${workflowRun.name}
Jobs: ❗ ${failedJobNames}
Branch: ${workflowRun.head_branch}
Commit: 🔗 ${workflowRun.head_sha}
Commit Message: 📝 ${workflowRun.head_commit?.message || 'N/A'}
Triggered by: 👤 ${workflowRun.actor?.login || 'N/A'}
View Logs: 🔗 ${workflowRun.html_url}
      `;
    } else {
      // For successes
      message = `
Repository: 📂 ${github.context.repo.repo}
Status: ${status}
Workflow: 🛠️ ${workflowRun.name}
Branch: ${workflowRun.head_branch}
Commit: 🔗 ${workflowRun.head_sha}
Commit Message: 📝 ${workflowRun.head_commit?.message || 'N/A'}
Triggered by: 👤 ${workflowRun.actor?.login || 'N/A'}
View Logs: 🔗 ${workflowRun.html_url}
      `;
    }
    // Send Telegram message
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

    core.info('Notification sent successfully');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();