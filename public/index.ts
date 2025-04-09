export async function initApp(root: HTMLPreElement) {
    const res = await fetch('/api');
    const data = await res.json();

    root.textContent = JSON.stringify(data, null, 2);
}

export const handleLogin = () => {
    const loginForm = document.getElementById('login-form') as HTMLFormElement;


    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });


                if (response.status !== 200) {
                    console.error("something went wrong");
                    return;
                }
            
                window.location.replace("/");
            
            } catch (error) {
                console.error("An error occurred during login:", error);
            }
        })}
        
        const registerButton = document.getElementById('register-button') as HTMLFormElement;
         if (registerButton) {
                registerButton.addEventListener('click', async (event) => {
                    event.preventDefault();
                   
                });
            }

            window.location.replace("/");
        }



