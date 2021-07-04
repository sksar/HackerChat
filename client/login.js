import prompt from 'prompt';

export default async function Login() {

    prompt.start();
    prompt.message = '';
    prompt.delimiter = ':';
    prompt.colors = false;

    const values = await prompt.get([
        {
            name: 'user',
            description: "👤 Username",
            pattern: /^[a-zA-Z\s\-]+$/,
            message: 'Username must be only letters, spaces, or dashes',
            required: true
        },
        {
            name: 'pass',
            description: "🔐 Password",
            pattern: /^\w+$/,
            message: 'Password must only be letters',
            hidden: true,
            replace: '*',
            required: true
        }
    ]);

    process.stdin.removeAllListeners('data');

    return values;

}