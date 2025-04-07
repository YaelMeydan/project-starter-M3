export async function initApp(root: HTMLPreElement) {
    const res = await fetch('/api/hello');
    const data = await res.json();

    root.textContent = JSON.stringify(data, null, 2);
}
