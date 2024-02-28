const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const git = simpleGit();

async function commitForPastDays(days) {
    const today = new Date();
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const dateString = date.toISOString();
        const formattedDateString = `${dateString.split('T')[0]}T18:52:46`;
        const filePath = path.join(__dirname, 'dummy.txt');

        // Create or update the dummy file
        fs.writeFileSync(filePath, `Commit for ${dateString}`);

        // Set environment variables for author and committer dates
        process.env.GIT_AUTHOR_DATE = formattedDateString;
        process.env.GIT_COMMITTER_DATE = formattedDateString;

        // Stage the file
        await git.add(filePath);

        // Commit with the specific date in environment variable
        await git.commit(`Commit on ${formattedDateString}`);

        // Clear the environment variables
        delete process.env.GIT_AUTHOR_DATE;
        delete process.env.GIT_COMMITTER_DATE;
    }
}

commitForPastDays(150)
    .then(() => console.log('Done!'))
    .catch(err => console.error('Error:', err));
