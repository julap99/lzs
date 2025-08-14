#!/usr/bin/env node

console.log('🚀 Starting CORRAD AF CLI...');

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const figlet = require('figlet');
const ora = require('ora');
const chalk = require('chalk');
const boxen = require('boxen');
const gradient = require('gradient-string');
const https = require('https');
const http = require('http');

// Function to fetch content from URL
function fetchFromUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.end();
  });
}

// Helper function to run shell commands with proper quoting
function runCommand(command, options = {}) {
  try {
    console.log(chalk.gray(`Running: ${command}`));
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    return false;
  }
}

// Helper function to properly quote project names with spaces
function escapeProjectName(projectName) {
  // Use double quotes for Windows and Unix compatibility
  return `"${projectName}"`;
}

// Helper function to run async commands
function runCommandAsync(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

// Create progress bar animation
function createProgressBar(message, duration = 3000) {
  return new Promise((resolve) => {
    const spinner = ora({
      text: message,
      spinner: {
        interval: 100,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
      }
    }).start();
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      spinner.text = `${message} ${progress}%`;
      
      if (progress >= 100) {
        clearInterval(interval);
        spinner.succeed(chalk.green('✓ Setup complete!'));
        resolve();
      }
    }, duration / 10);
  });
}

// Clear screen and display ASCII art
function displayHeader() {
  clearScreen();
  
  // Show ASCII "CORRAD AF" with gradient
  const asciiText = figlet.textSync('CORRAD AF', { 
    font: 'Big',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });
  
  console.log(gradient.rainbow(asciiText));
  console.log(boxen(
    chalk.white.bold('🚀 Welcome to CORRAD Application Framework CLI\n') +
    chalk.gray('The fastest way to bootstrap your next project'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ));
}

// Clear screen and position cursor at top
function clearScreen() {
  console.clear();
  process.stdout.write('\x1b[H');
}

// Check if current directory has project files
function hasProjectFiles() {
  const projectFiles = ['package.json', '.git', 'node_modules', 'src', 'pages', 'components'];
  return projectFiles.some(file => fs.existsSync(file));
}

// Parse .env.example file and extract variables
function parseEnvExample(content) {
  const lines = content.split('\n');
  const envVars = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/['"]/g, '');
      const description = extractComment(line);
      
      envVars.push({
        key: key.trim(),
        defaultValue: value.trim(),
        description: description
      });
    }
  }
  
  return envVars;
}

// Extract comment from env line
function extractComment(line) {
  const commentMatch = line.match(/#\s*(.+)$/);
  return commentMatch ? commentMatch[1].trim() : '';
}

// Create default .env.example file if it doesn't exist
function createDefaultEnvExample() {
  const defaultEnvContent = `# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/database_name" # Your MySQL connection string

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production" # Secret key for JWT tokens
AUTH_ORIGIN="http://localhost:3000" # Allowed origin for authentication

# Application
NUXT_SECRET_KEY="your-nuxt-secret-key-for-session-encryption" # Nuxt secret key
APP_NAME="Your Application Name" # Your application name
APP_URL="http://localhost:3000" # Your application URL

# Email Configuration (Optional)
MAIL_HOST="smtp.example.com" # SMTP server host
MAIL_PORT="587" # SMTP server port
MAIL_USERNAME="your-email@example.com" # SMTP username
MAIL_PASSWORD="your-email-password" # SMTP password
MAIL_FROM_ADDRESS="noreply@yourapp.com" # From email address
MAIL_FROM_NAME="Your App Name" # From name

# Development
NODE_ENV="development" # Environment (development, production)
NUXT_HOST="localhost" # Nuxt host
NUXT_PORT="3000" # Nuxt port
`;

  fs.writeFileSync('.env.example', defaultEnvContent);
  return defaultEnvContent;
}

// Check if environment is properly configured
function isEnvConfigured() {
  if (!fs.existsSync('.env')) {
    return false;
  }
  
  const envContent = fs.readFileSync('.env', 'utf-8');
  // Check if DATABASE_URL is properly set (not empty or default)
  const dbUrlMatch = envContent.match(/DATABASE_URL\s*=\s*["'](.+?)["']/);
  
  if (!dbUrlMatch) return false;
  
  const dbUrl = dbUrlMatch[1];
  return dbUrl && !dbUrl.includes('username:password');
}

// Main CLI function
async function main() {
  try {
    // Show the header once at the beginning
    displayHeader();

    // Check for existing project files
    const hasFiles = hasProjectFiles();
    
    // Step 2: Ask about project setup
    console.log(chalk.cyan.bold('\n📦 Project Setup'));
    if (hasFiles) {
      console.log(chalk.yellow('⚠️  Existing project files detected in current directory'));
    }
    
    const setupChoices = hasFiles ? [
      { name: 'Pull latest updates from CORRAD AF repository', value: 'pull' },
      { name: 'Start completely new project (will overwrite existing)', value: 'new' },
      { name: 'Cancel setup', value: 'cancel' }
    ] : [
      { name: 'Start new project by cloning CORRAD AF repository', value: 'new' },
      { name: 'Cancel setup', value: 'cancel' }
    ];

    const { setupAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'setupAction',
        message: 'What would you like to do?',
        choices: setupChoices,
        default: 0
      }
    ]);

    if (setupAction === 'cancel') {
      console.log(chalk.yellow('👋 Setup cancelled. Goodbye!'));
      process.exit(0);
    }

    // Display header again for consistency
    displayHeader();

    // Get project name (only for new projects)
    let projectName = path.basename(process.cwd());
    
    if (setupAction === 'new') {
      const { inputProjectName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'inputProjectName',
          message: 'Enter your project name:',
          default: 'my-corradaf-project',
          validate: function(input) {
            if (input.trim().length === 0) {
              return 'Project name cannot be empty';
            }
            // Check for invalid characters
            if (/[<>:"/\\|?*]/.test(input)) {
              return 'Project name contains invalid characters';
            }
            return true;
          }
        }
      ]);
      projectName = inputProjectName;
    }

    // Display header again for consistency
    displayHeader();

    // Step 3: Ask about environment setup
    console.log(chalk.cyan.bold('\n🔐 Environment Setup'));
    const { envSetupType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'envSetupType',
        message: 'How would you like to set up your environment?',
        choices: [
          {
            name: chalk.green('🔧 Manual Setup') + chalk.gray(' - Configure environment later'),
            value: 'manual'
          },
          {
            name: chalk.blue('🔗 Import from URL') + chalk.gray(' - Paste a configuration URL'),
            value: 'url'
          }
        ],
        default: 0
      }
    ]);

    // Display header again for consistency
    displayHeader();

    // Step 4: Ask about Cursor rules
    console.log(chalk.cyan.bold('\n⚙️  Development Tools'));
    const { useCursorRules } = await inquirer.prompt([
      {
        type: 'list',
        name: 'useCursorRules',
        message: 'Do you want to apply the optimized Cursor AI rules for better code assistance?',
        choices: [
          { name: 'Yes, apply Cursor AI rules (recommended)', value: true },
          { name: 'No, skip Cursor rules', value: false }
        ],
        default: 0
      }
    ]);

    // Display header again for consistency
    displayHeader();

    // Step 5: Show loading screen and setup project
    console.log(chalk.cyan.bold('\n🚀 Setting up your project...'));
    
    if (setupAction === 'new') {
      // Clone the repository with proper escaping
      const cloneSpinner = ora('Cloning CORRAD AF template...').start();
      const escapedProjectName = escapeProjectName(projectName);
      const success = runCommand(`git clone https://git.sena.my/corrad-software/corrad-af-2024.git ${escapedProjectName}`, { stdio: 'pipe' });
      
      if (!success) {
        cloneSpinner.fail('Failed to clone repository');
        process.exit(1);
      }
      cloneSpinner.succeed('Repository cloned successfully');

      // Change to project directory
      process.chdir(projectName);
    } else {
      // Pull latest updates
      const pullSpinner = ora('Pulling latest updates...').start();
      const success = runCommand('git pull origin main', { stdio: 'pipe' });
      
      if (!success) {
        pullSpinner.fail('Failed to pull updates');
        console.log(chalk.yellow('⚠️  You may need to resolve conflicts manually'));
      } else {
        pullSpinner.succeed('Updates pulled successfully');
      }
    }

    // Remove .git folder (user will init themselves later) - only for new projects
    if (setupAction === 'new') {
      const gitSpinner = ora('Cleaning up repository...').start();
      try {
        if (fs.existsSync('.git')) {
          if (process.platform === 'win32') {
            runCommand('rmdir /s /q .git', { stdio: 'pipe' });
          } else {
            runCommand('rm -rf .git', { stdio: 'pipe' });
          }
        }
        gitSpinner.succeed('Repository cleaned up');
      } catch (error) {
        gitSpinner.warn('Repository cleanup skipped');
      }
    }

    // Setup environment file
    if (envSetupType === 'url') {
      // Display header for consistency
      displayHeader();
      
      const { envUrl } = await inquirer.prompt([
        {
          type: 'input',
          name: 'envUrl',
          message: 'Enter the URL for your environment configuration:',
          validate: function(input) {
            if (!input.trim() || !input.startsWith('http')) {
              return 'Please enter a valid URL (starting with http:// or https://)';
            }
            return true;
          }
        }
      ]);
      
      const envSpinner = ora('Fetching environment configuration from URL...').start();
      
      try {
        // Fetch .env content from provided URL
        const envContent = await fetchFromUrl(envUrl);
        const processedContent = envContent.replace(/\${projectName}/g, projectName);
        
        fs.writeFileSync('.env', processedContent);
        envSpinner.succeed('Environment configuration imported successfully');
        
        // Run Prisma commands if the env is properly configured
        if (isEnvConfigured()) {
          const prismaSpinner = ora('Setting up Prisma database...').start();
          if (fs.existsSync('prisma/schema.prisma')) {
            const prismaSuccess = runCommand('npx prisma generate', { stdio: 'pipe' });
            if (prismaSuccess) {
              prismaSpinner.succeed('Prisma database configured');
            } else {
              prismaSpinner.fail('Prisma setup failed - please check your DATABASE_URL');
            }
          } else {
            prismaSpinner.warn('No Prisma schema found - skipping database setup');
          }
        }
      } catch (error) {
        envSpinner.fail('Failed to fetch environment configuration');
        console.log(chalk.yellow(`⚠️  Unable to access URL: ${error.message}`));
        console.log(chalk.gray('Creating a basic .env file you can edit later...'));
        
        // Create basic .env file from .env.example
        try {
          let exampleContent;
          if (fs.existsSync('.env.example')) {
            exampleContent = fs.readFileSync('.env.example', 'utf8');
          } else {
            exampleContent = createDefaultEnvExample();
          }
          fs.copyFileSync('.env.example', '.env');
          console.log(chalk.green('✓ Basic environment file created'));
          console.log(chalk.yellow('⚠️  Please edit the .env file and configure your DATABASE_URL before running Prisma commands'));
        } catch (error) {
          console.log(chalk.red(`Error creating .env file: ${error.message}`));
        }
      }
    } else {
      // Manual environment setup
      const envSpinner = ora('Setting up environment files...').start();
      
      try {
        // Create or ensure .env.example exists
        if (!fs.existsSync('.env.example')) {
          createDefaultEnvExample();
        }
        
        // Copy .env.example to .env without filling in values
        fs.copyFileSync('.env.example', '.env');
        envSpinner.succeed('Environment files created');
        console.log(chalk.green('✓ Created .env file from .env.example'));
        console.log(chalk.yellow('⚠️  Please edit the .env file and configure your DATABASE_URL before running Prisma commands'));
      } catch (error) {
        envSpinner.fail('Failed to set up environment');
        console.log(chalk.red(`Error: ${error.message}`));
      }
    }

    // Setup Cursor rules
    if (useCursorRules) {
      const cursorSpinner = ora('Applying Cursor AI rules...').start();
      
      const cursorRules = `# CORRAD AF Cursor Rules
# These rules optimize Cursor AI for working with the CORRAD Application Framework

### Behaviour rules
- You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved.
- If you are not sure about file content or codebase structure pertaining to the user's request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer.
- You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully.

### Coding rules
You are a Senior Full Stack Developer and an Expert in Vue, NuxtJS, JavaScript, TypeScript, HTML, SCSS and modern UI/UX frameworks (e.g., TailwindCSS, NuxtUI, Vuetify). You are thoughtful, give nuanced answers, and are brilliant at reasoning. You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

- Follow the user's requirements carefully & to the letter.
- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
- Confirm, then write code!
- Always write correct, best practice, KISS, DRY, SOLID, YAGNI principles, bug free, fully functional and working code.
- Avoid creating very large Vue components. When possible, extract functionality into separate sub-components.
- When working on an existing project, adapt to the existing conventions. If there's not enough context in the prompt to know what the conventions in the current project are, you MUST proactively read other files to find out.
- When asked to do something / create some kind of code, first read code of the same kind in the project so you know what's the project's syntax and practices.
- Before creating types or interfaces, first search through the project as the required types might already exist.
- Before creating migrations on backend, check what the correct command is in the package.json. After creation, check if the created migration contains only the added fields, otherwise remove the rest as the generator may add garbage.
- Focus on easy and readability code, over being performant.
- Fully implement all requested functionality.
- Leave NO todo's, placeholders or missing pieces.
- Ensure code is complete! Verify thoroughly finalised.
- Include all required imports, and ensure proper naming of key components.
- Be concise Minimize any other prose.
- If you think there might not be a correct answer, you say so.
- If you do not know the answer, say so, instead of guessing.
- When you want to show different options to solve an issue, do so WITHOUT implementing every option. First ask the user which one they would prefer.
- Every non-code part of your response should be written using Markdown, for better legibility.
- When using frameworks / UI libraries, you may use context7 to check the documentation on what components to use for the required task and how to use them correctly.
- IMPORTANT #1: Limit yourself to what you were asked to do. DO NOT REFACTOR / REWRITE code unless asked to. Instead, you MAY emit any recommendations you have at the end of your message (or you may do it at the start, and ask for confirmation, if you feel convenient).
- IMPORTANT #2: The user is a software engineer. Focus on what he asked you to change. Do not fix or change things that haven't been asked you to.
- IMPORTANT #3: Every change you implement must be carefuly though, and the implementation MUST BE ROBUST, unless specified otherwise by the user.

## CORRAD AF Framework Specific Rules

You are an expert in Nuxt 3, Vue 3, TypeScript, TailwindCSS, and the CORRAD AF framework.

Code Style Preferences:
- Use Composition API with <script setup>
- Prefer TypeScript for type safety
- Use TailwindCSS for styling
- Follow CORRAD AF patterns from llms.txt

Key Conventions:
- Use \`navigateTo()\` instead of \`router.push()\`
- Use \`definePageMeta()\` for page configuration
- Use \`ref()\` and \`reactive()\` for Vue 3 reactivity
- Prefer composables over mixins
- Use middleware for route protection

Framework Patterns:
- Follow the component templates in llms.txt
- Use rs-card, rs-button components
- Implement proper error handling
- Follow the API endpoint patterns
- Use Prisma for database operations

Security:
- Always validate inputs
- Use proper authentication patterns
- Implement RBAC where needed
- Follow security best practices from llms.txt
`;
      
      fs.writeFileSync('.cursorrules', cursorRules);
      cursorSpinner.succeed('Cursor AI rules applied');
    }

    // Show fancy loading progress
    await createProgressBar('Installing dependencies and setting up project', 4000);

    // Install dependencies
    const yarnSpinner = ora('Installing dependencies with Yarn...').start();
    const yarnSuccess = runCommand('yarn install', { stdio: 'pipe' });
    
    if (!yarnSuccess) {
      yarnSpinner.fail('Failed to install dependencies with Yarn');
      console.log(chalk.yellow('Trying with npm as fallback...'));
      
      const npmSpinner = ora('Installing dependencies with npm...').start();
      const npmSuccess = runCommand('npm install', { stdio: 'pipe' });
      
      if (!npmSuccess) {
        npmSpinner.fail('Failed to install dependencies');
        console.log(chalk.red('❌ Please install dependencies manually after setup'));
      } else {
        npmSpinner.succeed('Dependencies installed with npm');
      }
    } else {
      yarnSpinner.succeed('Dependencies installed with Yarn');
    }

    // Display header again for consistency at the end
    displayHeader();
    
    // Step 6: Success message and next steps
    const prismaNotes = isEnvConfigured() ? 
      '' : 
      chalk.yellow('\n⚠️  Important: Edit your .env file and configure your DATABASE_URL before running:\n') +
      chalk.gray('  npx prisma generate\n');
    
    const nextSteps = setupAction === 'new' ? [
      `  cd ${projectName}`,
      '  git init                # Initialize git repository',
      '  # Edit your .env file with proper configuration',
      '  npx prisma generate     # Generate Prisma client after configuring DATABASE_URL',
      '  yarn dev                # Start development server',
      '  yarn build              # Build for production',
      '  yarn start              # Start production server'
    ] : [
      '  # Edit your .env file with proper configuration',
      '  npx prisma generate     # Generate Prisma client after configuring DATABASE_URL',
      '  yarn dev                # Start development server',
      '  yarn build              # Build for production', 
      '  yarn start              # Start production server'
    ];

    console.log('\n' + boxen(
      chalk.green.bold('🎉 Project setup completed successfully!\n\n') +
      chalk.white(`Project: ${chalk.cyan.bold(projectName)}\n`) +
      chalk.white(`Action: ${chalk.yellow.bold(setupAction === 'new' ? 'New Project' : 'Updated Existing')}\n`) +
      chalk.white(`Location: ${chalk.gray(process.cwd())}\n`) +
      prismaNotes +
      chalk.white.bold('Next steps:\n') +
      nextSteps.map(step => chalk.gray(step)).join('\n'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
      }
    ));

    // Ask if user wants to open in IDE
    const { openIDE } = await inquirer.prompt([
      {
        type: 'list',
        name: 'openIDE',
        message: 'Would you like to open the project in your IDE now?',
        choices: [
          { name: 'Yes, open in IDE', value: true },
          { name: 'No, I will open it manually', value: false }
        ],
        default: 0
      }
    ]);

    if (openIDE) {
      console.log(chalk.cyan('Opening project in IDE...'));
      
      // Try different IDE commands
      const ideCommands = ['code .', 'cursor .', 'webstorm .', 'idea .'];
      let ideOpened = false;
      
      for (const cmd of ideCommands) {
        try {
          execSync(cmd, { stdio: 'pipe' });
          console.log(chalk.green(`✓ Opened in IDE with: ${cmd}`));
          ideOpened = true;
          break;
        } catch (error) {
          // Try next IDE
        }
      }
      
      if (!ideOpened) {
        console.log(chalk.yellow('Could not detect IDE. Please open the project manually.'));
      }
    }

    // Step 7: Auto close after showing final message
    console.log(chalk.gray('\n👋 CLI setup complete. You can now continue in your IDE terminal.'));
    console.log(chalk.gray('This terminal will close in 3 seconds...'));
    
    setTimeout(() => {
      process.exit(0);
    }, 3000);

  } catch (error) {
    if (error.isTtyError) {
      console.error(chalk.red('❌ This CLI requires an interactive terminal.'));
    } else {
      console.error(chalk.red('❌ Setup failed:'), error.message);
    }
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n👋 Setup cancelled by user. Goodbye!'));
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the CLI
console.log('📦 Calling main function...');
main().catch((error) => {
  console.error('❌ Main function error:', error);
  process.exit(1);
}); 