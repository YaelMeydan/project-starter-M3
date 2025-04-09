document.forms.namedItem("register")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(formElement));

    const res = await fetch("/register", {
        method: "post",
        body: JSON.stringify(formData),
        headers: {
            "content-type": "application/json",
        },
    });

    if (res.status !== 201) {
        console.error("something went wrong");
        return;
    }

    window.location.replace("/");
});