const git = require('simple-git')(process.cwd()); // Use current working directory
const lineReplace = require('line-replace');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const remote = await git.getRemotes(true);
        const origin = remote.filter(r => r.name === 'origin')[0];
        const originFetch = origin ? origin.refs.fetch : null;

        if (!originFetch) {
            throw new Error('No origin remote found');
        }

        const originRemote = originFetch
            .replace('https://', '')
            .replace('git@', '')
            .replace('.git', '')
            .replace(':', '/');

        const badgeUrl = `https://${originRemote}/actions/workflows/classroom.yml/badge.svg`;
        const badgeLink = `[![GitHub Classroom Workflow](${badgeUrl})](${badgeUrl})`;

        const readmePath = path.join(process.cwd(), 'README.md');
        const readmeExists = fs.existsSync(readmePath);

        if (!readmeExists) {
            throw new Error('README.md file not found');
        }

        lineReplace({
            file: readmePath,
            line: 3,
            text: badgeLink,
            callback: ({ file, line, text, replacedText, error }) => {
                if (error) throw error;

                lineReplace({
                    file: readmePath,
                    line: 8,
                    text: `- [x] update the assignment checks above to the correct link. - Done Automatically`,
                    callback: ({ file, line, text, replacedText, error }) => {
                        if (error) throw error;

                        git.add([readmePath]);
                        git.commit('update README file');
                    }
                });
            }
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
