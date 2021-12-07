module.exports = {
    apps: [
        {
            name: 'vr-crm',
            script: 'app.js',
            cwd: __dirname, // path-to-project
            instances: 2, // default 1
            autorestart: true,
            exec_mode: 'cluster', // allow scale up app
            env: {
                NODE_ENV: 'production',
            },
        },
    ],

    deploy: {
        staging: {
            user: 'tuyendv',
            host: '103.74.122.87',
            ref: 'origin/develop',
            repo: 'git@github.com:repo/repo.git',
            path: '/path/to/project',
            ssh_options: ['PasswordAuthentication=no', 'StrictHostKeyChecking=no'],
            'post-deploy': 'cd /path/to/project && yarn --production=false;yarn build;pm2 startOrReload ecosystem.config.js',
            env: {
                NODE_ENV: 'production',
            },
        },
    },
};